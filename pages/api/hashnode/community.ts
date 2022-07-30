import type { NextApiRequest, NextApiResponse } from "next";

import { getHashnodeCommunity } from "../../../lib/hashnode/hashnode.parser";
import { sendResponse } from "../../../lib/util/api.util";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  sendResponse(await getHashnodeCommunity(), res);
}
