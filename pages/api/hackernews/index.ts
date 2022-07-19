import type { NextApiRequest, NextApiResponse } from "next";

import { Endpoint, Index } from "../../../lib/types/index.interface";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.json(hnIndex());
}

export function hnIndex(): Index {
  const name = "Hacker News";
  const categoryName = null;
  const title = "Hacker News";
  return {
    name,
    categoryName,
    title,
    endpoints: getEndpointList(),
  };
}

function getEndpointList(): Endpoint[] {
  return [
    {
      type: "Trending",
      url: "/api/hackernews/trending",
    },
    {
      type: "Ask HN",
      url: "/api/hackernews/ask",
    },
    {
      type: "Show HN",
      url: "/api/hackernews/show",
    },
    {
      type: "Show HN (New)",
      url: "/api/hackernews/shownew",
    },
    {
      type: "New",
      url: "/api/hackernews/new",
    },
    {
      type: "Top (Last Hour)",
      url: "/api/hackernews/top?duration=hour",
    },
    {
      type: "Top (Last 24 Hours)",
      url: "/api/hackernews/top?duration=day",
    },
    {
      type: "Top (Last Week)",
      url: "/api/hackernews/top?duration=week",
    },
    {
      type: "Top (Last Month)",
      url: "/api/hackernews/top?duration=month",
    },
    {
      type: "Top (Last Year)",
      url: "/api/hackernews/top?duration=year",
    },
    {
      type: "Top (All Time)",
      url: "/api/hackernews/top?duration=all",
    },
  ];
}
