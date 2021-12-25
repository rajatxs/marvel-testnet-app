import { blockStorage, blockMapStorage } from "../config.js";

class BlockStorage {

   /**
    * Save new block to storage
    * @param {string | number} blockId
    * @param {import('./Block').default} block
    */
   push(blockId, block) {
      let blockKey = this.key(blockId);

      if (!this.has(blockKey)) {
         blockStorage.push(blockKey, block, false);
         blockMapStorage.push(blockKey, block.hash, false);
      }
   }

   /**
    * Get block object
    * @param {string | number} blockId 
    * @returns {import('./Block').default | undefined}
    */
   get(blockId) {
      return blockStorage.getObject(this.key(blockId));
   }

   /**
    * Get all blocks
    * @returns {any}
    */
   getAll() {
      return blockStorage.getData(':');
   }

   /**
    * Get hash value from block map storage
    * @param {string | number} blockId 
    * @returns {string}
    */
   getHash(blockId) {
      return blockMapStorage.getData(this.key(blockId));
   }

   /**
    * Get access key
    * @param {string | number} blockId 
    */
   key(blockId) {
      return ':' + blockId;
   }

   /**
    * Check whether specified block is exists or not
    * @param {string | number} blockId 
    */
   has(blockId) {
      return blockStorage.exists(this.key(blockId));
   }

   /** Get total numbers of object */
   count() {
      return blockStorage.count(":");
   }
}

export default BlockStorage;
