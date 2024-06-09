import { mergeTypeDefs } from "@graphql-tools/merge";
import usertypeDef from "./user.typeDef.js";
import transactionTypeDef from "./transaction.typeDef.js";

const mergedTypeDefs = mergeTypeDefs([usertypeDef, transactionTypeDef]);

export default mergedTypeDefs;
