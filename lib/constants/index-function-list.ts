import { hnIndex } from "../../pages/api/hackernews";
import { devIndex } from "../../pages/api/dev";
import { redditIndex } from "../../pages/api/reddit";

// Declare all the parser index functions here
const indexFunctionList = [hnIndex, devIndex, redditIndex];

export default indexFunctionList;
