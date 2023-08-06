import type { NextApiRequest, NextApiResponse } from "next";

import { getHashnodeTagNew } from "../../../lib/hashnode/hashnode.parser";
import { sendResponse } from "../../../lib/util/api.util";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { tag } = req.query;
  sendResponse(await getHashnodeTagNew(tag as string), res);
}
