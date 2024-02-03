import Snoowrap from "snoowrap";

import { Duration } from "../types/duration.enum";
import { NewsItem } from "../types/news-item.interface";

const REDDIT_HOME = "https://www.reddit.com";
const ITEM_COUNT = 30;

const reddit = new Snoowrap({
  userAgent: process.env.REDDIT_USER_AGENT,
  clientId: process.env.REDDIT_CLIENT_ID,
  clientSecret: process.env.REDDIT_CLIENT_SECRET,
  username: process.env.REDDIT_USERNAME,
  password: process.env.REDDIT_PASSWORD,
});

export async function getRedditHotItems(
  subreddit: string,
): Promise<NewsItem[]> {
  return fetchResponse(subreddit, RedditListType.HOT);
}

export async function getRedditNewItems(
  subreddit: string,
): Promise<NewsItem[]> {
  return fetchResponse(subreddit, RedditListType.NEW);
}

export async function getRedditRisingItems(
  subreddit: string,
): Promise<NewsItem[]> {
  return fetchResponse(subreddit, RedditListType.RISING);
}

export async function getRedditTopItems(
  subreddit: string,
  duration: Duration,
): Promise<NewsItem[]> {
  return fetchResponse(subreddit, RedditListType.TOP, duration);
}

export async function getRedditControversialItems(
  subreddit: string,
  duration: Duration,
): Promise<NewsItem[]> {
  return fetchResponse(subreddit, RedditListType.CONTROVERSIAL, duration);
}

async function fetchResponse(
  subreddit: string,
  type: RedditListType,
  duration?: Duration,
): Promise<NewsItem[]> {
  if (subreddit != undefined) {
    try {
      return transformToNewsItems(
        await getRedditSubmissions(subreddit, type, duration),
      );
    } catch (e) {
      console.error("Error while fetching data from Reddit API", e);
    }
  }
  return [];
}

function transformToNewsItems(
  response: Snoowrap.Listing<Snoowrap.Submission>,
): NewsItem[] {
  if (response != undefined) {
    return response
      .filter((item) => !item.stickied)
      .map((item) => {
        return {
          title: item.title,
          url: item.url,
          alternativeUrl: REDDIT_HOME + item.permalink,
          description: item.selftext,
          score: item.score,
        } as NewsItem;
      });
  }
  return [];
}

async function getRedditSubmissions(
  subreddit: string,
  type: RedditListType,
  duration?: Duration,
): Promise<Snoowrap.Listing<Snoowrap.Submission>> {
  if (subreddit == undefined) {
    return null;
  }

  let time;
  switch (duration) {
    case Duration.HOUR:
      time = "hour";
      break;
    case Duration.DAY:
      time = "day";
      break;
    case Duration.WEEK:
      time = "week";
      break;
    case Duration.MONTH:
      time = "month";
      break;
    case Duration.YEAR:
      time = "year";
      break;
    case Duration.ALL:
      time = "all";
      break;
    default:
      time = "day";
  }

  switch (type) {
    case RedditListType.HOT:
      return await reddit.getSubreddit(subreddit).getHot({ limit: ITEM_COUNT });
    case RedditListType.NEW:
      return await reddit.getSubreddit(subreddit).getNew({ limit: ITEM_COUNT });
    case RedditListType.RISING:
      return await reddit
        .getSubreddit(subreddit)
        .getRising({ limit: ITEM_COUNT });
    case RedditListType.CONTROVERSIAL:
      return await reddit
        .getSubreddit(subreddit)
        .getControversial({ limit: ITEM_COUNT, time: time });
    case RedditListType.TOP:
      return await reddit
        .getSubreddit(subreddit)
        .getTop({ limit: ITEM_COUNT, time: time });
    default:
      return await reddit.getSubreddit(subreddit).getHot({ limit: ITEM_COUNT });
  }
}

enum RedditListType {
  HOT,
  NEW,
  RISING,
  CONTROVERSIAL,
  TOP,
}
