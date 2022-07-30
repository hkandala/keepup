import type { NextApiRequest, NextApiResponse } from "next";

import { Endpoint, Index } from "../../../lib/types/index.interface";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.json(hashnodeIndex());
}

export function hashnodeIndex(): Index {
  const id = "hashnode";
  const name = "Hashnode";
  const categoryName = null;
  const title = "Hashnode";
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
      url: "/api/hashnode/featured",
    },
    {
      type: "Community",
      url: "/api/hashnode/community",
    },
    {
      type: "Recent",
      url: "/api/hashnode/recent",
    },
    {
      type: "Top (Last Week)",
      url: "/api/hashnode/top?duration=7",
    },
    {
      type: "Top (Last Month)",
      url: "/api/hashnode/top?duration=30",
    },
    {
      type: "Top (Last 3 Months)",
      url: "/api/hashnode/top?duration=90",
    },
    {
      type: "Top (Last 6 Months)",
      url: "/api/hashnode/top?duration=180",
    },
  ];
}
