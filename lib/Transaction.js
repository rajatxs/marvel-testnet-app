import { 
   generateSHA256Hash, 
   verifySHA256Hash,
   createSHA256Signature
} from "../utils/key.js";

class Transaction {

   /**
    * @param {string} from
    * @param {string} to 
    * @param {number} amount 
    */
   constructor(from, to, amount) {
      this.from = from;
      this.to = to;
      this.amount = amount;
      this.txHash = this.generateHash();
   }

   generateHash() {
      return generateSHA256Hash(this.toString());
   }

   /**
    * Create signature from `txHash`
    * @param {string} privateKey 
    */
   sign(privateKey) {
      return createSHA256Signature(this.txHash, privateKey);
   }

   /**
    * Verify `txHash`
    * @param {string} publicKey 
    * @param {Buffer | string} signature 
    */
   verify(publicKey, signature) {
      return verifySHA256Hash(this.txHash, publicKey, signature);
   }

   toString() {
      return JSON.stringify(this);
   }
}

export default Transaction;
