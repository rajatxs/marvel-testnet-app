import TokenContract from "./TokenContract.js";

class Wallet {
   #tokenContract = new TokenContract();
   #publicKey = '';
   #privateKey = '';

   get #msg() {
      return {
         sender: this.address,
         publicKey: this.#publicKey
      }
   }

   /**
    * @param {string} address 
    * @param {string} publicKey 
    * @param {string} privateKey 
    */
   constructor(address, publicKey, privateKey) {
      this.address = address;
      this.#publicKey = publicKey;
      this.#privateKey = privateKey;

      this.#tokenContract.addListener("token:transfer", (from, to, amount) => {
         console.log("TOKEN TRANSFERED", from, to, amount);
      });

      this.#tokenContract.addListener("token:approve", (sender, spender, amount) => {
         console.log("TOKEN APPROVED", sender, spender, amount);
      });
   }

   /**
    * Get allowance
    * @param {string} spender
    */
   allowance(spender) {
      return this.#tokenContract.allowance(this.address, spender);
   }

   /**
    * Allow spender to spend tokens
    * @param {string} spender 
    * @param {number} amount 
    */
   allowSpendTo(spender, amount) {
      this.#tokenContract.approve(spender, amount, this.#msg);
   }

   /**
    * Send tokens to receiver's account
    * @param {string} receiver 
    * @param {number} amount 
    */
   send(receiver, amount) {
      this.#tokenContract.transfer(receiver, amount, this.#msg);
   }

   /** Get transactions of owner */
   getTransactions() {
      return this.#tokenContract.getChain().filter((block) => {
         const tx = block.transaction;

         if (tx.from === this.address || tx.to === this.address) {
            return block;
         }
         return undefined;
      });
   }
   
   /** Get balance of owner */
   getBalance() {
      return this.#tokenContract.balanceOf(this.address);
   }
}

export default Wallet;
