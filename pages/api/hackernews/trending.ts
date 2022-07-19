import type { NextApiRequest, NextApiResponse } from "next";

import { getHNTrendingItems } from "../../../lib/hackernews/hackernews.parser";
import { sendResponse } from "../../../lib/util/api.util";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  sendResponse(await getHNTrendingItems(), res);
}
