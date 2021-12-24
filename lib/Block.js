import crypto from "crypto";

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
      const hash = crypto.createHash("SHA256");
      hash.update(str).end();

      return hash.digest("hex");
   }
}

export default Block;
