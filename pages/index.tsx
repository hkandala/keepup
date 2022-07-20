import { useEffect } from "react";
import ReactGA from "react-ga";
import SimpleBar from "simplebar-react";
import {
  Button,
  Divider,
  Spacer,
  Tag,
  Text,
  useMediaQuery,
  useToasts,
} from "@geist-ui/core";

import Metadata from "../components/Metadata";
import FeedCard from "../components/FeedCard";

import { dashboardIndex } from "./api/dashboard";
import { Emoji, Github } from "@geist-ui/icons";

export default function Home(props) {
  const metadata = {
    title: "keepup",
    description: "Keep up with all tech trends from a single page!",
    keywords: "news-aggregator, news-feed, trends, technology",
    manifestFile: "manifest.webmanifest",
    theme: "#fafafa",
    lightStatusColor: "#fafafa",
    darkStatusColor: "#35363a",
    favicon: "/favicon.ico",
    favicon16: "/favicon-16x16.png",
    favicon32: "/favicon-32x32.png",
    icon192: "/icons/icon-192x192.png",
    appleIcon: "/icons/apple-touch-icon.png",
    gaId: "UA-176784721-2",
  };

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
  }, [isDesktop, metadata.gaId, setToast]);

  return (
    <>
      <Metadata metadata={metadata} />

      <div className="center">
        <Text h3 className="title">
          {metadata.title}
        </Text>
      </div>

      <SimpleBar autoHide={false}>
        <div className="feed-wrapper">
          {props.feed.map((item) => (
            <div className="feed-item" key={item.title}>
              <FeedCard {...item}></FeedCard>
            </div>
          ))}
        </div>
      </SimpleBar>

      <div className="footer-wrapper">
        <Divider my={3} />

        <div className="footer">
          <a href="https://hkandala.dev/" target="_blank" rel="noreferrer">
            <Button scale={0.5} px={0.6} icon={<Emoji />} auto />
          </a>

          <div className="attribute">
            Made for{" "}
            <Tag scale={0.8} invert>
              <a
                href="https://planetscale.com/"
                target="_blank"
                rel="noreferrer"
              >
                planetscale
              </a>
            </Tag>{" "}
            x{" "}
            <Tag scale={0.8} invert>
              <a href="https://hashnode.com/" target="_blank" rel="noreferrer">
                hashnode
              </a>
            </Tag>{" "}
            hackathon
          </div>

          <a
            href="https://github.com/hkandala/keep-up"
            target="_blank"
            rel="noreferrer"
          >
            <Button scale={0.5} px={0.6} icon={<Github />} auto />
          </a>
        </div>

        <Spacer my={0.4} />
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  return {
    props: dashboardIndex(),
  };
}
