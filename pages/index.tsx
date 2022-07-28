import { useEffect, useState } from "react";
import { GetServerSidePropsContext } from "next";
import { unstable_getServerSession } from "next-auth";
import ReactGA from "react-ga";
import SimpleBar from "simplebar-react";
import { useMediaQuery, useToasts } from "@geist-ui/core";
import { useSession } from "next-auth/react";

import { authOptions } from "./api/auth/[...nextauth]";
import { dashboardIndex } from "./api/dashboard";
import { fetchFeedConfig } from "./api/config/feed";
import { listIndex } from "./api/config/parser_index";
import { fetchAllSaved } from "./api/saved";
import metadata from "../lib/constants/metadata";
import Metadata from "../components/Metadata";
import FeedCard from "../components/FeedCard";
import Menu from "../components/Menu";
import Footer from "../components/Footer";

export default function Home(props) {
  const isDesktop = useMediaQuery("md", { match: "up" });
  const { setToast } = useToasts({
    placement: "bottomLeft",
  });

  const savedItemsHook = useSavedItems(props.savedItems);

  useEffect(() => {
    if (window.location.hostname !== "localhost") {
      ReactGA.initialize(metadata.gaId);
      ReactGA.pageview(window.location.pathname + window.location.search);
    }

    if (!isDesktop) {
      const status = window.localStorage.getItem("scroll-notification");
      if (!status) {
        setToast({
          text: (
            <div className="scroll-nudge-toast">
              ➡️ ➡️ try scrolling this way ➡️ ➡️
            </div>
          ),
          delay: 10000,
        });
        window.localStorage.setItem("scroll-notification", "true");
      }
    }
  }, [isDesktop, setToast]);

  return (
    <>
      <Metadata />

      <Menu
        themeType={props.themeType}
        setTheme={props.setTheme}
        parserIndex={props.parserIndex}
        feedConfig={props.feedConfig}
        savedItemsHook={savedItemsHook}
      />

      <SimpleBar autoHide={false}>
        <div className="feed-wrapper">
          {props.dashboardIndex.feed.map((item) => (
            <div className="feed-item" key={item.title}>
              <FeedCard {...item} savedItemsHook={savedItemsHook}></FeedCard>
            </div>
          ))}
        </div>
      </SimpleBar>

      <Footer />
    </>
  );
}

export const getSavedItemHash = (item) =>
  btoa(
    unescape(
      encodeURIComponent(
        item.url +
          "||" +
          (item.alternativeUrl == null ? "alt" : item.alternativeUrl)
      )
    )
  );

export const useSavedItems = (savedItemsResponse) => {
  const { data: session, status } = useSession();
  const { setToast } = useToasts({
    placement: "bottomLeft",
  });

  const [savedItems, setSavedItems] = useState(
    savedItemsResponse.reduce((map, item) => {
      map[getSavedItemHash(item)] = item;
      return map;
    }, {})
  );
  const [savingItems, setSavingItems] = useState({});

  const addSavedItem = async (item) => {
    if (status === "authenticated") {
      try {
        const hash = getSavedItemHash(item);
        setSavingItems((value) => ({
          ...value,
          [hash]: true,
        }));

        const response = await (
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
          })
        ).json();

        setSavingItems((value) => ({
          ...value,
          [hash]: false,
        }));
        setSavedItems((value) => {
          const newValue = { ...value };
          newValue[hash] = response;
          return newValue;
        });
      } catch (e) {
        setToast({
          text: <span>&#9888; Error saving link</span>,
        });
      }
    } else {
      setToast({
        text: <span>&#9888; Please sign in to save links</span>,
        delay: 5000,
      });
    }
  };

  const deleteSavedItem = async (item) => {
    if (status === "authenticated") {
      try {
        const hash = getSavedItemHash(item);
        setSavingItems((value) => ({
          ...value,
          [hash]: true,
        }));

        const response = (
          await fetch("/api/saved", {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id: savedItems[hash].id,
            }),
          })
        ).json();

        setSavingItems((value) => ({
          ...value,
          [hash]: false,
        }));
        setSavedItems((value) => {
          const newValue = { ...value };
          delete newValue[hash];
          return newValue;
        });
      } catch (e) {
        setToast({
          text: <span>&#9888; Error removing saved link</span>,
        });
      }
    } else {
      setToast({
        text: <span>&#9888; Please sign in to save links</span>,
        delay: 5000,
      });
    }
  };

  return [savedItems, savingItems, addSavedItem, deleteSavedItem];
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  const [dashboardIndexData, parserIndexData, feedConfigData, savedItemsData] =
    await Promise.all([
      dashboardIndex(session),
      listIndex(),
      fetchFeedConfig(session),
      fetchAllSaved(session),
    ]);

  return {
    props: {
      dashboardIndex: dashboardIndexData,
      parserIndex: parserIndexData,
      feedConfig: feedConfigData,
      savedItems: savedItemsData,
    },
  };
}
