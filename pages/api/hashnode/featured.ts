import type { NextApiRequest, NextApiResponse } from "next";

import { getHashnodeFeatured } from "../../../lib/hashnode/hashnode.parser";
import { sendResponse } from "../../../lib/util/api.util";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  sendResponse(await getHashnodeFeatured(), res);
}
