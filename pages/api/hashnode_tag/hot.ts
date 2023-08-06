import type { NextApiRequest, NextApiResponse } from "next";

import { getHashnodeTagHot } from "../../../lib/hashnode/hashnode.parser";
import { sendResponse } from "../../../lib/util/api.util";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { tag } = req.query;
  sendResponse(await getHashnodeTagHot(tag as string), res);
}
