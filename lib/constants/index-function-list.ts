import { hnIndex } from "../../pages/api/hackernews";
import { hashnodeIndex } from "../../pages/api/hashnode";
import { hashnodeTagIndex } from "../../pages/api/hashnode_tag";
import { devIndex } from "../../pages/api/dev";
import { redditIndex } from "../../pages/api/reddit";

// Declare all the parser index functions here
const indexFunctionList = [
  hnIndex,
  hashnodeIndex,
  hashnodeTagIndex,
  devIndex,
  redditIndex,
];

export default indexFunctionList;
