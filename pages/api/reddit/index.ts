import type { NextApiRequest, NextApiResponse } from "next";

import { Endpoint, Index } from "../../../lib/types/index.interface";
import { getEndpointListFromSubType } from "../../../lib/util/api.util";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  let { subreddit } = req.query;
  res.json(redditIndex(subreddit as string));
}

export function redditIndex(subreddit?: string): Index {
  const id = "reddit";
  const name = "Reddit";
  const categoryName = "Subreddit";
  const title = "r/{}";
  if (subreddit != null) {
    return {
      id,
      name,
      categoryName,
      title: title.replace("{}", subreddit),
      endpoints: getEndpointListFromSubType(subreddit, getEndpointList()),
    };
  } else {
    return {
      id,
      name,
      categoryName,
      title,
      endpoints: getEndpointList(),
    };
  }
}

function getEndpointList(): Endpoint[] {
  return [
    {
      type: "Hot",
      url: "/api/reddit/hot?subreddit={}",
    },
    {
      type: "New",
      url: "/api/reddit/new?subreddit={}",
    },
    {
      type: "Rising",
      url: "/api/reddit/rising?subreddit={}",
    },
    {
      type: "Top (Last Hour)",
      url: "/api/reddit/top?subreddit={}&duration=hour",
    },
    {
      type: "Top (Last 24 Hours)",
      url: "/api/reddit/top?subreddit={}&duration=day",
    },
    {
      type: "Top (Last Week)",
      url: "/api/reddit/top?subreddit={}&duration=week",
    },
    {
      type: "Top (Last Month)",
      url: "/api/reddit/top?subreddit={}&duration=month",
    },
    {
      type: "Top (Last Year)",
      url: "/api/reddit/top?subreddit={}&duration=year",
    },
    {
      type: "Top (All Time)",
      url: "/api/reddit/top?subreddit={}&duration=all",
    },
    {
      type: "Controversial (Last Hour)",
      url: "/api/reddit/controversial?subreddit={}&duration=hour",
    },
    {
      type: "Controversial (Last 24 Hours)",
      url: "/api/reddit/controversial?subreddit={}&duration=day",
    },
    {
      type: "Controversial (Last Week)",
      url: "/api/reddit/controversial?subreddit={}&duration=week",
    },
    {
      type: "Controversial (Last Month)",
      url: "/api/reddit/controversial?subreddit={}&duration=month",
    },
    {
      type: "Controversial (Last Year)",
      url: "/api/reddit/controversial?subreddit={}&duration=year",
    },
    {
      type: "Controversial (All Time)",
      url: "/api/reddit/controversial?subreddit={}&duration=all",
    },
  ];
}
