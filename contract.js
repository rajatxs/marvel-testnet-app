import TokenContract from "./lib/TokenContract.js";
import { ownerAccount } from "./config.js";

const contract = new TokenContract(ownerAccount);

export default contract;
