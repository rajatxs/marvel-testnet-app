import { EventEmitter } from "events";
import chalk from "chalk";
import Block from "./Block.js";
import BlockStorage from "./BlockStorage.js";

class BlockChain extends EventEmitter {
   blockStorage = new BlockStorage();

   /** @type {import('./Block').default[]} */
   _chain = [];

   constructor(options = {}) {
      super();
      this.options = options;
   }

   /** 
    * Insert new block in chain
    * @param {import('./Block').default} newBlock
    */
   #insertBlock(newBlock) {
      const newBlockNumber = this.$blockNumber;

      if (this.#verifyBlock(newBlock)) {
         this._chain.push(newBlock);
         this.blockStorage.push(newBlockNumber, newBlock);

         if (this.options['logs']) {
            process.stdout.write(`${chalk.green('Block created')} [${newBlock.timestamp}] ${chalk.grey(newBlock.hash)}\n`);
         }
      } else {
         throw new Error("Block does not verified");
      }
   }

   getChain() {
      return this._chain;
   }

   /**
    * Add new block into chain
    * @param {import('./Transaction').default} transaction 
    */
   addBlock(transaction) {
      const prevBlock = this.$lastBlock;
      let newBlock;

      if (prevBlock) {
         newBlock = new Block(prevBlock.hash, transaction);
      } else {
         newBlock = new Block('0', transaction);
      }

      this.#insertBlock(newBlock);
   }

   /** Last inserted block */
   get $lastBlock() {
      return this._chain[this._chain.length - 1];
   }

   /** Latest block number */
   get $blockNumber() {
      return this._chain.length;
   }

   /** Chech whether chain requires genesis block or not */
   get $requireGenesisBlock() {
      return !(this.blockStorage.has(0));
   }

   /**
    * Verify block
    * @param {import('./Block').default} block 
    * @returns {boolean}
    */
   #verifyBlock(block) {   
      const hash = block.generateHash();
      return hash === block.hash;
   }

   /**
    * Verify chain of block
    * @param {import('./Block').default[]} blocks 
    * @returns {[boolean, object]}
    */
   #verifyChain(blocks) {
      let verified = true, unVerifiedBlock = {};

      for (let blockIndex in blocks) {
         const currentBlock = blocks[blockIndex];
         const nextBlock = blocks[Number(blockIndex) + 1];
         const hashMap = this.blockStorage.getHash(blockIndex);

         if ((!this.#verifyBlock(currentBlock)) || currentBlock.hash !== hashMap) {
            verified = false;
            unVerifiedBlock = {
               blockNumber: blockIndex,
               hash: currentBlock.hash,
            };
            break;
         }

         // check for hash order
         if (nextBlock && nextBlock.prevHash !== currentBlock.hash) {
            verified = false;
            unVerifiedBlock = {
               blockNumber: blockIndex,
               hash: currentBlock.hash,
            };
            break;
         }
      }

      return [verified, unVerifiedBlock];
   }

   /** Load block data from file storage */
   loadBlocks() {
      let verified, unVerifiedBlock;
      const blocks = Object.values(this.blockStorage.getAll()).map((block, index) => {
         if (this.blockStorage.getHash(index) !== block.hash) {
            throw new Error("Invalid hash found on block " + index);
         }

         return new Block(block.prevHash, block.transaction, block.timestamp);
      });

      [verified, unVerifiedBlock] = this.#verifyChain(blocks);

      if (!verified) {
         throw new Error(
            `Found unverified block \nblockNumber: ${unVerifiedBlock.blockNumber},\nhash: ${unVerifiedBlock.hash}\n`
         );
      } else {
         this._chain = blocks;
      }
   }
}

export default BlockChain;