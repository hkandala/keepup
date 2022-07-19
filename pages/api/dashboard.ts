import type { NextApiRequest, NextApiResponse } from "next";

import { devIndex } from "./dev";
import { hnIndex } from "./hackernews";
import { redditIndex } from "./reddit";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  return res.json(dashboardIndex());
}

export function dashboardIndex() {
  return {
    feed: [
      hnIndex(),
      devIndex(),
      redditIndex("programming"),
      redditIndex("javascript"),
      redditIndex("java"),
      redditIndex("machinelearning"),
    ],
  };
}
