import assert from "assert";
import { EventEmitter } from "events";
import chalk from "chalk";
import Block from "./Block.js";
import Chain from "./Chain.js";
import BlockStorage from "./BlockStorage.js";

class BlockChain extends EventEmitter {
   blockStorage = new BlockStorage();
   #chain = new Chain();

   load = this.#chain.load.bind(this.#chain);

   /** @type {Map<string, import('./Transaction').default>} */
   _txPool = new Map();

   constructor(options = {}) {
      super();
      this.options = options;
   }

   /** 
    * Insert new block in chain
    * @param {import('./Block').default} newBlock
    */
   #insertBlock(newBlock) {
      newBlock.verifyHash(newBlock.hash);
      this.#chain.push(newBlock);
   
      if (this.options['logs']) {
         process.stdout.write(`${chalk.green('Block created')} [${newBlock.timestamp}] ${chalk.grey(newBlock.hash)}\n`);
      }
   }

   /** Get value of `_chain` */
   chain() {
      return this.#chain.list;
   }

   /**
    * Add new block into chain
    * @param {string} txHash 
    * @param {string} publicKey
    * @param {Buffer | string} signature
    */
   addBlock(txHash, publicKey, signature) {
      const tx = this._txPool.get(txHash);
      const { lastBlock, blockId } = this.#chain;
      let newBlock, txVerified;

      assert(tx, "Invalid tx");

      txVerified = tx.verify(publicKey, signature);
      assert(txVerified, "Unverified tx");

      if (lastBlock) {
         newBlock = new Block(blockId, lastBlock.hash, tx);
      } else {
         newBlock = new Block(blockId, '0', tx);
      }

      this.#insertBlock(newBlock);
   }

   /** Chech whether chain requires genesis block or not */
   get $requireGenesisBlock() {
      return !(this.blockStorage.has(0));
   }

   /**
    * Insert `tx` into `txPool`
    * @param {import('./Transaction').default} tx 
    */
   $createTransaction(tx) {
      const { txHash } = tx;

      if (this._txPool.has(txHash)) {
         throw new Error("Tx conflict");
      }

      this._txPool.set(txHash, tx);
      return txHash;
   }
   
   /**
    * Execute transaction from `txPool`
    * @param {string} txHash 
    * @param {string} publicKey 
    * @param {Buffer | string} txSign 
    */
   $executeTransaction(txHash, publicKey, txSign) {
      assert(this._txPool.has(txHash), "Invalid txHash");

      this.addBlock(txHash, publicKey, txSign);
      this._txPool.delete(txHash);
   }
}

export default BlockChain;
