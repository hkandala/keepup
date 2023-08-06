import Axios from "axios";
import { NewsItem } from "../types/news-item.interface";

const HASHNODE_HOME = "https://hashnode.com/api";

export async function getHashnodeFeatured(): Promise<NewsItem[]> {
  return fetchResponse(HashnodeListType.FEATURED, null, null);
}

export async function getHashnodeCommunity(): Promise<NewsItem[]> {
  return fetchResponse(HashnodeListType.COMMUNITY, null, null);
}

export async function getHashnodeRecent(): Promise<NewsItem[]> {
  return fetchResponse(HashnodeListType.RECENT, null, null);
}

export async function getHashnodeTop(
  duration: HashnodeDuration,
): Promise<NewsItem[]> {
  return fetchResponse(HashnodeListType.TOP, null, duration);
}

export async function getHashnodeTagHot(tag: string): Promise<NewsItem[]> {
  return fetchResponse(HashnodeListType.HOT, tag, null);
}

export async function getHashnodeTagNew(tag: string): Promise<NewsItem[]> {
  return fetchResponse(HashnodeListType.RECENT, tag, null);
}

async function fetchResponse(
  type: HashnodeListType,
  tag?: string,
  duration?: HashnodeDuration,
): Promise<NewsItem[]> {
  try {
    const response = await Axios.get(generateUrl(type, tag, duration));
    return transformToNewsItems(response.data);
  } catch (e) {
    console.error("Error while fetching data from Hashnode API", e);
  }
}

function transformToNewsItems(resp: any): NewsItem[] {
  if (resp?.posts) {
    return resp.posts.map((item) => {
      return {
        title: item.title,
        url: item.publicationDomain
          ? `https://${item.publicationDomain}/${item.slug}`
          : item.publication.domain
          ? `https://${item.publication.domain}/${item.slug}`
          : `https://${item.publication.username}.hashnode.dev/${item.slug}`,
        alternativeUrl: null,
        description: item.brief,
        score: item.totalReactions,
      } as NewsItem;
    });
  }
  return [];
}

function generateUrl(
  type: HashnodeListType,
  tag?: string,
  duration?: HashnodeDuration,
): string {
  let typeUrl;
  switch (type) {
    case HashnodeListType.FEATURED:
      typeUrl = "featured";
      break;
    case HashnodeListType.COMMUNITY:
      typeUrl = "community";
      break;
    case HashnodeListType.RECENT:
      typeUrl = "recent";
      break;
    case HashnodeListType.HOT:
      typeUrl = "hot";
      break;
    case HashnodeListType.TOP:
      typeUrl = "get-top-posts";
      break;
    default:
      typeUrl = "hot";
  }

  let durationUrl;
  switch (duration) {
    case HashnodeDuration.WEEK:
      durationUrl = "7";
      break;
    case HashnodeDuration.MONTH:
      durationUrl = "30";
      break;
    case HashnodeDuration.THREE_MONTHS:
      durationUrl = "90";
      break;
    case HashnodeDuration.SIX_MONTHS:
      durationUrl = "180";
      break;
    default:
      durationUrl = "7";
  }

  if (tag == undefined) {
    if (type == HashnodeListType.TOP) {
      return `${HASHNODE_HOME}/post/${typeUrl}?duration=${durationUrl}`;
    } else {
      return `${HASHNODE_HOME}/feed/${typeUrl}`;
    }
  } else {
    return `${HASHNODE_HOME}/feed/tag/${tag}?type=${typeUrl}`;
  }
}

export enum HashnodeListType {
  FEATURED,
  COMMUNITY,
  RECENT,
  HOT,
  TOP,
}

export enum HashnodeDuration {
  WEEK,
  MONTH,
  THREE_MONTHS,
  SIX_MONTHS,
}
