import type { NextApiRequest, NextApiResponse } from "next";

import { getRedditNewItems } from "../../../lib/reddit/reddit.parser";
import { sendResponse } from "../../../lib/util/api.util";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { subreddit } = req.query;
  sendResponse(await getRedditNewItems(subreddit as string), res);
}
