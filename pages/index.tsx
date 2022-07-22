import { useEffect } from "react";
import { GetServerSidePropsContext } from "next";
import { unstable_getServerSession } from "next-auth";
import ReactGA from "react-ga";
import SimpleBar from "simplebar-react";
import { useMediaQuery, useToasts } from "@geist-ui/core";

import { authOptions } from "./api/auth/[...nextauth]";
import { dashboardIndex } from "./api/dashboard";
import { fetchFeedConfig } from "./api/config/feed";
import { listIndex } from "./api/config/parser_index";
import metadata from "../lib/constants/metadata";
import Metadata from "../components/Metadata";
import FeedCard from "../components/FeedCard";
import Menu from "../components/Menu";
import Footer from "../components/Footer";

export default function Home(props) {
  const isDesktop = useMediaQuery("md", { match: "up" });
  const { setToast } = useToasts();

  useEffect(() => {
    if (window.location.hostname !== "localhost") {
      ReactGA.initialize(metadata.gaId);
      ReactGA.pageview(window.location.pathname + window.location.search);
    }

    if (!isDesktop) {
      const status = window.localStorage.getItem("scroll-notification");
      if (!status) {
        setToast({ text: "Try scrolling this way 👉", delay: 10000 });
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
      />

      <SimpleBar autoHide={false}>
        <div className="feed-wrapper">
          {props.dashboardIndex.feed.map((item) => (
            <div className="feed-item" key={item.title}>
              <FeedCard {...item}></FeedCard>
            </div>
          ))}
        </div>
      </SimpleBar>

      <Footer />
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  const [dashboardIndexData, parserIndexData, feedConfigData] =
    await Promise.all([
      dashboardIndex(session),
      listIndex(),
      fetchFeedConfig(session),
    ]);

  return {
    props: {
      dashboardIndex: dashboardIndexData,
      parserIndex: parserIndexData,
      feedConfig: feedConfigData,
    },
  };
}
