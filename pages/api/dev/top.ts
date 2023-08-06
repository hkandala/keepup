import type { NextApiRequest, NextApiResponse } from "next";

import { getDevTopItems } from "../../../lib/dev/dev.parser";
import { getDurationFromQuery, sendResponse } from "../../../lib/util/api.util";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  sendResponse(await getDevTopItems(getDurationFromQuery(req)), res);
}
