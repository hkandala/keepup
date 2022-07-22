import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth/next";
import { Prisma } from "@prisma/client";
import Joi from "joi";

import prisma from "../../../lib/util/prisma";
import { FeedConfig } from "../../../lib/types/feed-config.interface";
import defaultFeedConfigList from "../../../lib/util/feed-config.default";
import indexFunctionList from "../../../lib/util/index-function-list";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await unstable_getServerSession(req, res, authOptions);
  if (req.method === "GET") {
    return res.json(await fetchFeedConfig(session));
  } else if (req.method === "POST") {
    if (session) {
      const [status, data] = await updateFeedConfig(session, req.body);
      return res.status(status as number).json(data);
    }
  } else {
    return res.status(401).json({ error: "No user available in session." });
  }
}

export async function fetchFeedConfig(session: any): Promise<FeedConfig[]> {
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

  return feedConfigList;
}

export async function updateFeedConfig(session: any, body: any) {
  const feedConfigRequestSchema = Joi.array()
    .required()
    .min(1)
    .items(
      Joi.object({
        id: Joi.string()
          .required()
          .valid(...indexFunctionList.map((f) => f().id)),
        categoryName: Joi.string().allow(null),
        endpointIndex: indexFunctionList.reduce((joi, f) => {
          return joi.when("id", {
            is: f().id,
            then: Joi.number()
              .integer()
              .min(0)
              .max(f().endpoints.length - 1),
          });
        }, Joi.number().required()),
      })
    )
    .unique(
      (a, b) =>
        a.id === b.id &&
        a.categoryName === b.categoryName &&
        a.endpointIndex === b.endpointIndex
    );

  const { error, value } = feedConfigRequestSchema.validate(body);
  const requestConfig = value as FeedConfig[];

  if (error) {
    return [400, error];
  }

  await prisma.feedConfig.upsert({
    create: {
      userId: session.user.id,
      config: (<any>requestConfig) as Prisma.JsonArray,
    },
    update: {
      config: (<any>requestConfig) as Prisma.JsonArray,
    },
    where: {
      userId: session.user.id,
    },
  });

  return [200, value];
}
