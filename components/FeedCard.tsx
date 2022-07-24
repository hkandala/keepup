import { useCallback, useEffect, useState, Fragment } from "react";
import { useSession } from "next-auth/react";
import SimpleBar from "simplebar-react";
import ClampLines from "react-clamp-lines";
import { Heart, HeartFill } from "@geist-ui/icons";
import {
  Badge,
  Card,
  Divider,
  Link,
  Loading,
  Select,
  Spinner,
  Text,
  useMediaQuery,
  useTheme,
  useToasts,
} from "@geist-ui/core";

export default function FeedCard(props) {
  const { data: session, status } = useSession();
  const theme = useTheme();
  const { setToast } = useToasts({
    placement: "bottomLeft",
    maxWidth: "300px",
  });

  const [items, setItems] = useState({ feedItems: [], isFetching: false });
  const [savingItems, setSavingItems] = useState({});

  const fetchItems = useCallback(
    async (index) => {
      try {
        setItems({ feedItems: [], isFetching: true });
        const response = await fetch(props.endpoints[Number(index)].url);
        const responseJson = await response.json();
        setItems({ feedItems: responseJson, isFetching: false });
      } catch (e) {
        console.error(e);
        setItems({ feedItems: [], isFetching: false });
      }
    },
    [props.endpoints]
  );

  const saveItem = async (item) => {
    if (status === "authenticated") {
      try {
        const hash = getHash(item);
        setSavingItems((value) => ({
          ...value,
          [hash]: true,
        }));

        await fetch("/api/saved", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: item.title,
            url: item.url,
            alternativeUrl: item.alternativeUrl,
          }),
        });

        setSavingItems((value) => ({
          ...value,
          [hash]: false,
        }));
        props.setSavedItems((value) => [
          ...value,
          {
            title: item.title,
            url: item.url,
            alternativeUrl: item.alternativeUrl,
          },
        ]);
        setToast({
          text: "Saved!",
          type: "success",
          delay: 2000,
        });
      } catch {
        setToast({
          text: "Error saving link",
          type: "error",
          delay: 2000,
        });
      }
    } else {
      setToast({
        text: "Please sign in to save links",
        type: "warning",
        delay: 5000,
      });
    }
  };

  const getHash = (item) => {
    const hashCode = (s) =>
      s.split("").reduce((a, b) => {
        a = (a << 5) - a + b.charCodeAt(0);
        return a & a;
      }, 0);
    return hashCode(
      item.url + (item.alternativeUrl == null ? "" : item.alternativeUrl)
    );
  };

  const endpointIndex = props.endpointIndex;
  const savedHashSet = new Set();
  props.savedItems.forEach((item) => savedHashSet.add(getHash(item)));

  useEffect(() => {
    fetchItems(endpointIndex);
  }, [endpointIndex, fetchItems]);

  const isDesktop = useMediaQuery("md", { match: "up" });
  const [height, setHeight] = useState({
    list: "550px",
    spinner: "500px",
    error: "500px",
  });
  useEffect(() => {
    if (!isDesktop && window.innerHeight) {
      setHeight({
        list: window.innerHeight - 195 + "px",
        spinner: window.innerHeight - 240 + "px",
        error: window.innerHeight - 240 + "px",
      });
    }
  }, [isDesktop]);

  let feedContent;
  const itemCount = items.feedItems.length;

  if (items.isFetching) {
    feedContent = (
      <div className="center" style={{ height: height.spinner }}>
        <Spinner scale={2} />
      </div>
    );
  } else if (items.feedItems.length == 0) {
    feedContent = (
      <div className="center" style={{ height: height.error }}>
        <Text b>Uh oh, something wrong happened :(</Text>
      </div>
    );
  } else {
    feedContent = items.feedItems.map((item, index) => (
      <Fragment key={index}>
        <div
          className={
            theme.type == "custom-dark" ? "list-item dark" : "list-item"
          }
        >
          <div className="badge-wrapper">
            <a
              href={item.url}
              onClick={(e) => {
                e.preventDefault();
                window
                  .open(
                    item.alternativeUrl ? item.alternativeUrl : item.url,
                    "_blank"
                  )
                  .focus();
              }}
            >
              <Badge scale={0.75}>{item.score}</Badge>
            </a>
          </div>
          <div className="link-content">
            <Link href={item.url} title={item.title} target="_blank">
              <Text small>{item.title}</Text>
            </Link>
            {item.description != undefined && item.description != "" ? (
              <>
                <Divider my={0.5} />
                <ClampLines
                  id={item.url}
                  text={item.description}
                  className="description"
                />
              </>
            ) : (
              <></>
            )}
          </div>
          <div className="bookmark-wrapper">
            <a
              href={item.url}
              onClick={(e) => {
                e.preventDefault();
                saveItem(item);
              }}
            >
              {savingItems[getHash(item)] ? (
                <Loading scale={0.4} />
              ) : savedHashSet.has(getHash(item)) ? (
                <HeartFill size={15} />
              ) : (
                <Heart size={15} />
              )}
            </a>
          </div>
        </div>
        {index + 1 < itemCount ? <Divider my={1.8} /> : <></>}
      </Fragment>
    ));
  }

  return (
    <Card shadow className="card">
      <Card.Content className="feed-header-wrapper">
        <Text h4>{props.title}</Text>
        <Select
          initialValue={endpointIndex.toString()}
          onChange={fetchItems}
          scale={0.6}
          className="select-wrapper"
          disableMatchWidth
        >
          {props.endpoints.map((endpoint, index) => (
            <Select.Option value={index.toString()} key={index}>
              {endpoint.type}
            </Select.Option>
          ))}
        </Select>
      </Card.Content>
      <Divider my={0} />
      <SimpleBar className="list-wrapper" style={{ height: height.list }}>
        <Card.Content>{feedContent}</Card.Content>
      </SimpleBar>
    </Card>
  );
}
