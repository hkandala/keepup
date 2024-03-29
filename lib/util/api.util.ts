import type { NextApiRequest, NextApiResponse } from "next";

import { Duration } from "../types/duration.enum";
import { Endpoint } from "../types/index.interface";
import { NewsItem } from "../types/news-item.interface";

export function sendResponse(
  apiResponse: NewsItem[],
  response: NextApiResponse,
): void {
  if (apiResponse.length > 0) {
    response.json(apiResponse);
  } else {
    response.status(500);
    response.json([]);
  }
}

export function getDurationFromQuery(query: NextApiRequest): Duration {
  const { duration } = query.query;
  switch (duration) {
    case "hour":
      return Duration.HOUR;
    case "day":
      return Duration.DAY;
    case "week":
      return Duration.WEEK;
    case "month":
      return Duration.MONTH;
    case "year":
      return Duration.YEAR;
    case "all":
      return Duration.ALL;
    default:
      return Duration.DAY;
  }
}

export function getEndpointListFromSubType(
  subtype: string,
  endpointList: Endpoint[],
): Endpoint[] {
  return endpointList.map((endpoint) => {
    return {
      type: endpoint.type,
      url: endpoint.url.replace("{}", subtype),
    };
  });
}
