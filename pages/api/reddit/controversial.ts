import type { NextApiRequest, NextApiResponse } from "next";

import { getRedditControversialItems } from "../../../lib/reddit/reddit.parser";
import { getDurationFromQuery, sendResponse } from "../../../lib/util/api.util";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { subreddit } = req.query;
  sendResponse(
    await getRedditControversialItems(
      subreddit as string,
      getDurationFromQuery(req),
    ),
    res,
  );
}
