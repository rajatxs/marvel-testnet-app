import assert from "assert";
import { EventEmitter } from "events";
import Block from "./Block.js";
import BlockStorage from "./BlockStorage.js";

class Chain extends EventEmitter {
   blockStorage = new BlockStorage();

   /** @type {import('./Block').default[]} */
   #chain = [];

   /** Chain list */
   get list() {
      return this.#chain;
   }

   /** Total number of blocks */
   get size() {
      return this.#chain.length;
   }

   /** Last inserted block */
   get lastBlock() {
      return this.#chain[this.#chain.length - 1];
   }

   /** Block id */
   get blockId() {
      const { lastBlock } = this;

      return lastBlock ? lastBlock.blockId + 1 : 0;
   }

   /**
    * Insert new block into chain
    * @param {import("./Block").default} block
    * @returns {number}
    */
   push(block) {
      this.#chain.push(block);
      this.blockStorage.push(block.blockId, block);
      return block.blockId;
   }

   /** Load chain data */
   load() {
      let chain = [], chainData = {};

      chainData = this.blockStorage.getAll();

      for (let blockKey in chainData) {
         const blockId = Number(blockKey);
         const blockObject = chainData[blockKey];
         let block;

         assert(
            blockId === blockObject.blockId,
            `Found invalid block key: ${blockKey}`
         );

         block = new Block(
            blockObject.blockId,
            blockObject.prevHash,
            blockObject.transaction,
            blockObject.timestamp
         );

         assert(block.verifyHash(blockObject.hash), `Invalid block hash: ${blockKey}`);
         chain.push(block);
      }

      this.verifyOrder(chain);
      this.#chain = chain;
   }

   /**
    * Verify chain data
    * @param {import('./Block').default[]} chain
    */
   verifyOrder(chain = []) {
      for (let blockIndex in chain) {
         const currentBlock = chain[blockIndex];
         const nextBlock = chain[Number(blockIndex) + 1];

         if (nextBlock) {
            assert(
               nextBlock.prevHash === currentBlock.hash,
               `Invalid chain order: ${blockIndex}`
            );
         }
      }
   }
}

export default Chain;
