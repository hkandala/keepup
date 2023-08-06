import type { NextApiRequest, NextApiResponse } from "next";

import { getDevFeaturedItems } from "../../../lib/dev/dev.parser";
import { sendResponse } from "../../../lib/util/api.util";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  sendResponse(await getDevFeaturedItems(), res);
}
