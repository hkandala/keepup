import type { NextApiRequest, NextApiResponse } from "next";

import {
  getHashnodeTop,
  HashnodeDuration,
} from "../../../lib/hashnode/hashnode.parser";
import { sendResponse } from "../../../lib/util/api.util";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  sendResponse(await getHashnodeTop(getDurationFromQuery(req)), res);
}

export function getDurationFromQuery(query: NextApiRequest): HashnodeDuration {
  const { duration } = query.query;
  switch (Number(duration)) {
    case 7:
      return HashnodeDuration.WEEK;
    case 30:
      return HashnodeDuration.MONTH;
    case 90:
      return HashnodeDuration.THREE_MONTHS;
    case 180:
      return HashnodeDuration.SIX_MONTHS;
    default:
      return HashnodeDuration.WEEK;
  }
}
