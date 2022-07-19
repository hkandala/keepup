import type { NextApiRequest, NextApiResponse } from "next";

import { getAskHNItems } from "../../../lib/hackernews/hackernews.parser";
import { sendResponse } from "../../../lib/util/api.util";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  sendResponse(await getAskHNItems(), res);
}
