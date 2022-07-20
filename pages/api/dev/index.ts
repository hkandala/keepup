import type { NextApiRequest, NextApiResponse } from "next";

import { Endpoint, Index } from "../../../lib/types/index.interface";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.json(devIndex());
}

export function devIndex(): Index {
  const id = "dev";
  const name = "Dev.to";
  const categoryName = null;
  const title = "Dev.to";
  return {
    id,
    name,
    categoryName,
    title,
    endpoints: getEndpointList(),
  };
}

function getEndpointList(): Endpoint[] {
  return [
    {
      type: "Featured",
      url: "/api/dev/featured",
    },
    {
      type: "Rising",
      url: "/api/dev/rising",
    },
    {
      type: "Fresh",
      url: "/api/dev/fresh",
    },
    {
      type: "Top (Last 24 Hours)",
      url: "/api/dev/top?duration=day",
    },
    {
      type: "Top (Last Week)",
      url: "/api/dev/top?duration=week",
    },
    {
      type: "Top (Last Month)",
      url: "/api/dev/top?duration=month",
    },
    {
      type: "Top (Last Year)",
      url: "/api/dev/top?duration=year",
    },
    {
      type: "Top (All Time)",
      url: "/api/dev/top?duration=all",
    },
  ];
}
