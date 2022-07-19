import type { NextApiRequest, NextApiResponse } from "next";

import { getRedditRisingItems } from "../../../lib/reddit/reddit.parser";
import { sendResponse } from "../../../lib/util/api.util";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { subreddit } = req.query;
  sendResponse(await getRedditRisingItems(subreddit as string), res);
}
