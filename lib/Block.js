import { generateSHA256Hash } from "../utils/key.js";

class Block {

   /**
    * @param {string} prevHash 
    * @param {import('./Transaction').default} transaction 
    * @param {number} timestamp 
    */
   constructor(prevHash, transaction, timestamp = Date.now()) {
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
         prevHash: this.prevHash,
         transaction: this.transaction,
         timestamp: this.timestamp,
      });

      return generateSHA256Hash(str);
   }
}

export default Block;
