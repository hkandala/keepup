import type { NextApiRequest, NextApiResponse } from "next";

import indexFunctionList from "../../../lib/constants/index-function-list";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  return res.json(listIndex());
}

export function listIndex() {
  return indexFunctionList.map((index) => index());
}
