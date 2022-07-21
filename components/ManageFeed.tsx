import { useCallback, useEffect, useState } from "react";
import { ReactSortable } from "react-sortablejs";
import {
  AutoComplete,
  Input,
  Spinner,
  Text,
  useTheme,
  useToasts,
} from "@geist-ui/core";
import { Menu } from "@geist-ui/icons";

export default function ManageFeed(props) {
  const theme = useTheme();
  const { setToast } = useToasts();

  const [config, setConfig] = useState({
    data: {},
    isFetching: false,
  } as any);
  const [newConfig, setNewConfig] = useState([]);

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

  const fetchConfig = useCallback(async () => {
    try {
      setConfig({
        data: {},
        isFetching: true,
      });

      const [feedConfig, parserIndex] = await Promise.all([
        (await fetch("/api/config/feed")).json(),
        (await fetch("/api/config/parser_index")).json(),
      ]);

      const parserMap = {};
      parserIndex.forEach((parser) => (parserMap[parser.id] = parser));
      // add random keys which will be essential for the sortable to work
      feedConfig.forEach(
        (item) => (item.key = (Math.random() + 1).toString(36).substring(7))
      );

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

      setConfig({
        data: {
          feedConfig,
          parserIndex,
          parserMap,
          sourceOptions,
          sourceOptionsNameToIdMap,
          sourceOptionsIdToNameMap,
          categoryOptionsMap,
          categoryOptionsTypeToIndexMap,
          categoryOptionsIndexToTypeMap,
        },
        isFetching: false,
      });
      setNewConfig(feedConfig);
    } catch (e) {
      console.error(e);
      setConfig({
        data: {},
        isFetching: false,
      });
    }
  }, [setConfig, setNewConfig]);

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
      value = value == "" ? null : value;
      if (origItem.categoryName === value) {
        return;
      }
      item = Object.assign({}, origItem, {
        categoryName: value,
      });
    } else if (type === "endpointIndex") {
      value = Number(value);
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

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  if (config.isFetching) {
    return (
      <div>
        <Spinner scale={2} />
      </div>
    );
  } else if (config.data.length == 0) {
    return (
      <div>
        <Text b>Uh oh, something wrong happened :(</Text>
      </div>
    );
  } else {
    const {
      parserMap,
      sourceOptions,
      sourceOptionsNameToIdMap,
      sourceOptionsIdToNameMap,
      categoryOptionsMap,
      categoryOptionsTypeToIndexMap,
      categoryOptionsIndexToTypeMap,
    } = config.data;

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
              <div>
                <AutoComplete
                  disableFreeSolo
                  disableMatchWidth
                  options={sourceOptions as any}
                  placeholder="Feed Source"
                  initialValue={sourceOptionsIdToNameMap[item.id]}
                  getPopupContainer={() =>
                    document.getElementsByClassName("wrapper")[0] as HTMLElement
                  }
                  onSelect={(value) =>
                    updateNewConfig(
                      "id",
                      sourceOptionsNameToIdMap[value],
                      itemIndex
                    )
                  }
                />
                {parserMap[item.id].categoryName ? (
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
                  initialValue={categoryOptionsIndexToTypeMap[item.id][
                    item.endpointIndex
                  ].toString()}
                  getPopupContainer={() =>
                    document.getElementsByClassName("wrapper")[0] as HTMLElement
                  }
                  onSelect={(value) =>
                    updateNewConfig(
                      "endpointIndex",
                      categoryOptionsTypeToIndexMap[item.id][value],
                      itemIndex
                    )
                  }
                />
              </div>
            </div>
          ))}
        </ReactSortable>
        <style jsx global>{`
          .item.active {
            color: ${theme.palette.foreground} !important;
          }
        `}</style>
      </>
    );
  }
}
