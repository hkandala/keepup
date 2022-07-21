import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth/next";

import { Index } from "../../lib/types/index.interface";
import indexFunctionList from "../../lib/util/index-function-list";
import { authOptions } from "../api/auth/[...nextauth]";
import { fetchFeedConfig } from "./config/feed";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await unstable_getServerSession(req, res, authOptions);
  return res.json(await dashboardIndex(session));
}

export async function dashboardIndex(session: any) {
  const feedConfigList = await fetchFeedConfig(session);

  return {
    feed: feedConfigList.map((feedConfig) => {
      return {
        ...fetchIndex(feedConfig.id, feedConfig.categoryName),
        endpointIndex: feedConfig.endpointIndex,
      };
    }),
  };
}

function fetchIndex(id: string, category: string): Index {
  const indexFunction = indexFunctionMap().get(id);
  if (indexFunction) {
    if (category) {
      return indexFunction(category);
    } else {
      return indexFunction();
    }
  } else {
    throw new Error(`No index found for id: ${id}`);
  }
}

function indexFunctionMap(): Map<string, Function> {
  const map = new Map<string, Function>();
  indexFunctionList.forEach((f) => {
    map.set(f().id, f);
  });
  return map;
}
