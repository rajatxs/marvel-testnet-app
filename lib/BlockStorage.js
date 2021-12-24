import { blockStorage, blockMapStorage } from "../config.js";

class BlockStorage {

   /**
    * Save new block to storage
    * @param {string | number} blockNumber
    * @param {import('./Block').default} block
    */
   push(blockNumber, block) {
      let blockKey = this.key(blockNumber);

      if (!this.has(blockKey)) {
         blockStorage.push(blockKey, block, false);
         blockMapStorage.push(blockKey, block.hash, false);
      }
   }

   /**
    * Get block object
    * @param {string | number} blockNumber 
    * @returns {import('./Block').default | undefined}
    */
   get(blockNumber) {
      return blockStorage.getObject(this.key(blockNumber));
   }

   /**
    * Get all blocks
    * @returns {import('./Block').default[]}
    */
   getAll() {
      return blockStorage.getData('/');
   }

   /**
    * Get hash value from block map storage
    * @param {string | number} blockNumber 
    * @returns {string}
    */
   getHash(blockNumber) {
      return blockMapStorage.getData(this.key(blockNumber));
   }

   /**
    * Get access key
    * @param {string | number} blockNumber 
    */
   key(blockNumber) {
      return '/' + blockNumber;
   }

   /**
    * Check whether specified block is exists or not
    * @param {string | number} blockNumber 
    */
   has(blockNumber) {
      return blockStorage.exists(this.key(blockNumber));
   }

   /** Get total numbers of object */
   count() {
      return blockStorage.count("/");
   }
}

export default BlockStorage;
