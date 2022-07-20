import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth/next";

import prisma from "../../lib/util/prisma";
import { Index } from "../../lib/types/index.interface";
import { FeedConfig } from "../../lib/types/feed-config.interface";
import defaultFeedConfigList from "../../lib/util/feed-config.default";
import { authOptions } from "../api/auth/[...nextauth]";

import { hnIndex } from "./hackernews";
import { devIndex } from "./dev";
import { redditIndex } from "./reddit";
import { Prisma } from "@prisma/client";

const indexFunctionList = [hnIndex, devIndex, redditIndex];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await unstable_getServerSession(req, res, authOptions);
  return res.json(await dashboardIndex(session));
}

export async function dashboardIndex(session: any) {
  let feedConfigList: FeedConfig[] = [];
  if (session) {
    const feedConfigItem = await prisma.feedConfig.findUnique({
      where: {
        userId: session.user.id,
      },
    });

    if (feedConfigItem) {
      feedConfigList = (<any>feedConfigItem.config) as FeedConfig[];
    } else {
      // Initialise with default feed config list on first sign in
      feedConfigList = defaultFeedConfigList;
      await prisma.feedConfig.create({
        data: {
          userId: session.user.id,
          config: (<any>defaultFeedConfigList) as Prisma.JsonArray,
        },
      });
    }
  } else {
    // Use default feed config list for unauthorised users
    feedConfigList = defaultFeedConfigList;
  }

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
