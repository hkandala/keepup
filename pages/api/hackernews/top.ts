import type { NextApiRequest, NextApiResponse } from "next";

import { getHNTopItems } from "../../../lib/hackernews/hn-algolia.parser";
import { getDurationFromQuery, sendResponse } from "../../../lib/util/api.util";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  sendResponse(await getHNTopItems(getDurationFromQuery(req)), res);
}
