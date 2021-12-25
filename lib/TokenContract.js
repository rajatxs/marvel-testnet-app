import assert from "assert";
import BlockChain from "./Blockchain.js";
import Transaction from "./Transaction.js";

/**
 * @typedef BlockMessage
 * @property {string} [sender]
 * @property {string} [publicKey]
 * @property {string} [txHash]
 * @property {string} [txSign]
 */

class TokenContract extends BlockChain {
   #supply = 1000;
   #allowances = new Map();

   constructor(deployer = {}) {
      super({
         logs: true,
      });

      if (this.$requireGenesisBlock) {
         this.#addGenesisBlock(deployer);
      } else {
         this.load();
      }
   }

   #addGenesisBlock(deployer = {}) {
      const tx = new Transaction("0", deployer.address, this.#supply);
      const genesisBlockSign = tx.sign(deployer.privateKey);
      const txHash = this.$createTransaction(tx);
      this.$executeTransaction(txHash, deployer.publicKey, genesisBlockSign);
   }

   /**
    * Get balance of `address`
    * @param {string} address 
    */
   balanceOf(address) {
      let balance = 0;

      this.chain().forEach((block) => {
         let amount = block.transaction.amount;

         if (block.transaction.from === address) {
            balance -= amount;
         } else if (block.transaction.to === address) {
            balance += amount;
         }
      });

      return balance;
   }

   /**
    * Approve some amount of tokens for transfer
    * @param {string} spender
    * @param {number} amount
    * @param {any} msg
    */
   approve(spender, amount, msg = {}) {
      this.#_approve(msg.sender, spender, amount);
   }

   /**
    * Get allowance of spender
    * @param {string} sender
    * @param {string} spender
    * @returns {number}
    */
   allowance(sender, spender) {
      const currentApproval = this.#allowances.get(sender) || {};
      return currentApproval[spender] || 0;
   }

   /**
    * Transfer tokens from sender's account to receiver's account
    * @param {string} receiver
    * @param {number} amount
    * @param {BlockMessage} msg
    */
   transfer(receiver, amount, msg = {}) {
      this.#_transfer(msg.sender, receiver, amount, msg);
      return true;
   }

   /**
    * Transfer tokens from sender's account to receiver's account
    * @param {string} sender
    * @param {string} receiver
    * @param {number} amount
    * @param {BlockMessage} msg
    */
   transferFrom(sender, receiver, amount, msg = {}) {
      let currentAllowance;

      this.#_transfer(sender, receiver, amount, msg);

      currentAllowance = this.allowance(sender, msg.sender);
      assert(currentAllowance >= amount, "Transfer amount exceeds allowance");

      this.#_approve(sender, msg.sender, currentAllowance - amount);
      return true;
   }

   /**
    * Approve some amount of tokens for transfer
    * @param {string} sender
    * @param {string} spender
    * @param {number} amount
    */
   #_approve(sender, spender, amount) {
      let newApproval = this.#allowances.get(sender) || {};

      newApproval[spender] = amount;
      this.#allowances.set(sender, newApproval);
      this.emit("token:approve", sender, spender, amount);
   }

   /**
    * Transfer tokens from sender's account to receiver's account
    * @param {string} sender
    * @param {string} receiver
    * @param {number} amount
    * @param {BlockMessage} msg
    */
   #_transfer(sender, receiver, amount, msg = {}) {
      let senderBalance = 0, tx, txHash;
      assert(sender !== receiver, "Can't transfer to same address");
      assert(amount > 0, "Cannot accept 0 amount");

      senderBalance = this.balanceOf(sender);

      assert(senderBalance >= amount, "Transfer amount exceeds balance");

      this.addBlock(
         msg.txHash,
         msg.sender,
         msg.txSign,
      );
      this.emit("token:transfer", sender, receiver, amount);
   }
}

export default TokenContract;
