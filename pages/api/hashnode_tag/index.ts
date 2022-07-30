import type { NextApiRequest, NextApiResponse } from "next";

import { Endpoint, Index } from "../../../lib/types/index.interface";
import { getEndpointListFromSubType } from "../../../lib/util/api.util";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  let { tag } = req.query;
  res.json(hashnodeTagIndex(tag as string));
}

export function hashnodeTagIndex(tag?: string): Index {
  const id = "hashnode_tag";
  const name = "Hashnode Tag";
  const categoryName = "Tag";
  const title = "#{}";
  if (tag != null) {
    return {
      id,
      name,
      categoryName,
      title: title.replace("{}", tag),
      endpoints: getEndpointListFromSubType(tag, getEndpointList()),
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
      url: "/api/hashnode_tag/hot?tag={}",
    },
    {
      type: "New",
      url: "/api/hashnode_tag/new?tag={}",
    },
  ];
}
