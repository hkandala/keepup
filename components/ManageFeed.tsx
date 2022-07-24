import { useState } from "react";
import { ReactSortable } from "react-sortablejs";
import Router from "next/router";
import {
  AutoComplete,
  Button,
  Input,
  Spacer,
  useTheme,
  useToasts,
} from "@geist-ui/core";
import { Frown, Menu, PlusCircle, Trash2 } from "@geist-ui/icons";

export default function ManageFeed(props) {
  const theme = useTheme();
  const { setToast } = useToasts({
    placement: "bottomLeft",
  });

  const [saving, setSaving] = useState(false);

  const sortableOptions = {
    animation: 200,
    handle: ".sortable-handle",
    ghostClass: "sortable-ghost",
    forceFallback: true,
    onChoose: () =>
      (document.getElementById("feed-drawer").style.cursor = "grabbing"),
    onStart: () =>
      (document.getElementById("feed-drawer").style.cursor = "grabbing"),
    onEnd: () =>
      (document.getElementById("feed-drawer").style.cursor = "grabbing"),
  };

  // Create a copy of the props to avoid sortable render issues
  const [feedConfig, parserIndex] = [
    props.feedConfig.map((x) => {
      return { ...x };
    }),
    props.parserIndex.map((x) => {
      return { ...x };
    }),
  ];

  const parserMap = {};
  parserIndex.forEach((parser) => (parserMap[parser.id] = parser));
  // add random keys which will be essential for the sortable to work
  feedConfig.forEach(
    (item) => (item.key = (Math.random() + 1).toString(36).substring(7))
  );

  const [newConfig, setNewConfig] = useState(feedConfig);

  const sourceOptions = parserIndex.map((item) => ({
    label: item.name,
    value: item.name,
  }));

  const sourceOptionsNameToIdMap = parserIndex.reduce((map, item) => {
    map[item.name] = item.id;
    return map;
  }, {});

  const sourceOptionsIdToNameMap = parserIndex.reduce((map, item) => {
    map[item.id] = item.name;
    return map;
  }, {});

  const categoryOptionsMap = parserIndex.reduce((map, item) => {
    map[item.id] = item.endpoints.map((category) => ({
      label: category.type,
      value: category.type,
    }));
    return map;
  }, {});

  const categoryOptionsTypeToIndexMap = parserIndex.reduce((map, item) => {
    let index = 0;
    map[item.id] = item.endpoints.reduce((typeMap, category) => {
      typeMap[category.type] = index++;
      return typeMap;
    }, {});
    return map;
  }, {});

  const categoryOptionsIndexToTypeMap = parserIndex.reduce((map, item) => {
    let index = 0;
    map[item.id] = item.endpoints.reduce((typeMap, category) => {
      typeMap[index++] = category.type;
      return typeMap;
    }, {});
    return map;
  }, {});

  const updateNewConfig = (type, value, index) => {
    if (!(newConfig && newConfig[index])) {
      return;
    }

    const origItem = newConfig[index];
    let item: any = {};
    if (type === "id") {
      if (origItem.id === value) {
        return;
      }
      item = Object.assign({}, origItem, {
        // key change is required to trigger a re-render
        key: (Math.random() + 1).toString(36).substring(7),
        id: value,
        categoryName: null,
        endpointIndex: 0,
      });
    } else if (type === "categoryName") {
      value = value === "" ? null : value;
      if (origItem.categoryName === value) {
        return;
      }
      item = Object.assign({}, origItem, {
        categoryName: value,
      });
    } else if (type === "endpointIndex") {
      value = value === "" ? null : value;
      if (origItem.endpointIndex === value) {
        return;
      }
      item = Object.assign({}, origItem, { endpointIndex: value });
    } else {
      return;
    }

    const newConfigCopy = [...newConfig];
    newConfigCopy[index] = item;
    setNewConfig(newConfigCopy);
  };

  const deleteItem = (index) => {
    if (newConfig.length > 1) {
      const newConfigCopy = [...newConfig];
      newConfigCopy.splice(index, 1);
      setNewConfig(newConfigCopy);
    } else {
      setToast({
        text: <span>&#9888; Feed cannot be empty</span>,
      });
    }
  };

  const addItem = () => {
    const newConfigCopy = [...newConfig];
    newConfigCopy.push({
      key: (Math.random() + 1).toString(36).substring(7),
      id: null,
      categoryName: null,
      endpointIndex: null,
    });
    setNewConfig(newConfigCopy);
  };

  const saveChanges = async () => {
    let error = false;
    let duplicate = false;
    let keySet = new Set();

    newConfig.forEach((item) => {
      if (item.id == null || item.id === "") {
        error = true;
        return;
      }
      if (item.endpointIndex == null) {
        error = true;
        return;
      }
      if (parserMap[item.id].categoryName != null) {
        if (item.categoryName == null || item.categoryName === "") {
          error = true;
          return;
        }
      }

      const key = item.id + "-" + item.categoryName + "-" + item.endpointIndex;
      if (keySet.has(key)) {
        duplicate = true;
        return;
      } else {
        keySet.add(key);
      }
    });

    if (error) {
      setToast({
        text: <span>&#9888; Few fields are empty</span>,
      });
    } else if (duplicate) {
      setToast({
        text: <span>&#9888; Duplicate entries are not allowed</span>,
      });
    } else {
      try {
        setSaving(true);
        const body = newConfig.map((item) => ({
          id: item.id,
          categoryName: item.categoryName,
          endpointIndex: item.endpointIndex,
        }));
        await fetch("/api/config/feed", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });
        Router.reload();
      } catch (error) {
        console.error(error);
        setToast({
          text: <span>&#9888; Error updating feed</span>,
          type: "error",
        });
      }
    }
  };

  if (!newConfig || newConfig.length == 0) {
    return (
      <div className="center">
        <Spacer my={1} />
        <Frown scale={2} />
      </div>
    );
  } else {
    return (
      <>
        <ReactSortable
          id="sortable-list"
          list={newConfig}
          setList={setNewConfig}
          {...sortableOptions}
        >
          {newConfig.map((item, itemIndex) => (
            <div
              key={item.key}
              className="manage-feed-item-wrapper"
              style={{ boxShadow: theme.expressiveness.shadowSmall }}
            >
              <div className="sortable-handle">
                <Menu size={14} />
              </div>
              <div className="manage-feed-input">
                <AutoComplete
                  disableFreeSolo
                  disableMatchWidth
                  options={sourceOptions as any}
                  placeholder="Feed Source"
                  initialValue={sourceOptionsIdToNameMap[item.id]}
                  getPopupContainer={() =>
                    document.getElementById("sortable-list") as HTMLElement
                  }
                  onChange={(value) => {
                    if (value === "") {
                      updateNewConfig("id", null, itemIndex);
                    }
                  }}
                  onSelect={(value) =>
                    updateNewConfig(
                      "id",
                      sourceOptionsNameToIdMap[value],
                      itemIndex
                    )
                  }
                />
                {parserMap[item.id]?.categoryName ? (
                  <Input
                    placeholder={parserMap[item.id].categoryName}
                    initialValue={item.categoryName}
                    onBlur={(e) =>
                      updateNewConfig("categoryName", e.target.value, itemIndex)
                    }
                  />
                ) : (
                  <></>
                )}
                <AutoComplete
                  disableFreeSolo
                  disableMatchWidth
                  options={categoryOptionsMap[item.id]}
                  placeholder="Feed Type"
                  initialValue={categoryOptionsIndexToTypeMap[item.id]?.[
                    item.endpointIndex
                  ]?.toString()}
                  getPopupContainer={() =>
                    document.getElementById("sortable-list") as HTMLElement
                  }
                  onChange={(value) => {
                    if (value === "") {
                      updateNewConfig("endpointIndex", null, itemIndex);
                    }
                  }}
                  onSelect={(value) =>
                    updateNewConfig(
                      "endpointIndex",
                      categoryOptionsTypeToIndexMap[item.id][value],
                      itemIndex
                    )
                  }
                />
              </div>
              <div
                className="manage-feed-delete"
                onClick={() => deleteItem(itemIndex)}
              >
                <Trash2 size={14} />
              </div>
            </div>
          ))}
        </ReactSortable>
        <div
          className="manage-feed-add"
          style={{ boxShadow: theme.expressiveness.shadowSmall }}
          onClick={addItem}
        >
          <PlusCircle scale={4} />
        </div>
        <Button
          width="100%"
          scale={1.2}
          type="secondary"
          loading={saving}
          onClick={saveChanges}
        >
          Save
        </Button>
        <style jsx global>{`
          .item.active {
            color: ${theme.palette.foreground} !important;
          }
        `}</style>
      </>
    );
  }
}
