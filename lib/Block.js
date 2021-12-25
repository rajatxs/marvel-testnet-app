import assert from "assert";
import { generateSHA256Hash } from "../utils/key.js";

class Block {

   /**
    * @param {number} blockId
    * @param {string} prevHash 
    * @param {import('./Transaction').default} transaction 
    * @param {number} timestamp 
    */
   constructor(blockId, prevHash, transaction, timestamp = Date.now()) {
      this.blockId = Number(blockId);
      this.prevHash = prevHash;
      this.transaction = transaction;
      this.timestamp = timestamp;
      this.hash = this.generateHash();
   }

   /**
    * Generate has block
    * @returns {string}
    */
   generateHash() {
      const str = JSON.stringify({
         blockId: this.blockId,
         prevHash: this.prevHash,
         transaction: this.transaction,
         timestamp: this.timestamp,
      });

      return generateSHA256Hash(str);
   }

   /**
    * Verify block hash
    * @param {string} hash 
    */
   verifyHash(hash) {
      const currentHash = this.generateHash();
      return currentHash === hash;
   }
}

export default Block;
