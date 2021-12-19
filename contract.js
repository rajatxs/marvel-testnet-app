const crypto = require("crypto-js");

class Blockchain {
   blocks = [];

   addBlock(payload = {}) {
      const lastBlock = this.getLastBlock();

      payload.nonce = 0;
      payload.timestamp = String(Date.now());
      payload.prevHash = (this.blocks.length > 0)? lastBlock.hash: '0';
      payload.hash = crypto.SHA256(JSON.stringify(payload)).toString();
      
      this.blocks.push(payload);
   }

   getLastBlock() {
      return this.blocks[this.blocks.length - 1];
   }
}

class SmartContract extends Blockchain {
   stake = [];
   _storage = {
      address: '',
      totalSuppply: 10000,
      balances: {}
   };

   get storage() {
      return this._storage;
   }

   set storage(state) {
      this._storage = state;
   }

   constructor() {
      super();

      this.storage.address = "contract:dapp";
      this.transfer('0', "rajat", this.storage.totalSuppply);
   }

   balanceOf(address) {
      let val = 0;

      this.blocks.forEach((block) => {
         if (block['from'] === address) {
            val += block.amount;
         } else if (block['to'] === address) {
            val -= block.amount;
         }
      });

      return Math.abs(val);
   }

   transfer(from, to, amount) {
      this._addTransaction("TRANSFER", from, to, amount);
      this._execTransactions();
   }

   transactionsOf(address) {
      let txList = [];

      this.blocks.forEach(block => {
         if (block['from'] === address || block['to'] === address) {
            txList.push(block);
         }
      })

      return txList;
   }

   _execTransactions() {
      const state = this.storage;

      this.stake.forEach((tx) => {
         switch(tx.type) {
            case 'TRANSFER': {
               if (tx.from !== '0') {
                  state.balances[tx.from] = this.balanceOf(tx.from) + tx.amount;
               }
               state.balances[tx.to] = this.balanceOf(tx.to) + tx.amount;
            }
         }

         this.addBlock(tx);
      });

      this.storage = state;
      this.stake = [];
   }

   _addTransaction(type, from, to, amount) {
      amount = Number(amount);
      const txHash = crypto.SHA256(type + from + to + amount + String(Date.now())).toString();
      let txObject = {
         type,
         txHash,
         from,
         to,
         amount
      };

      if (from !== '0') {
         if (!(this.balanceOf(from) >= amount)) {
            throw new Error("Insufficient balance");
         }
      }

      this.stake.push(txObject);
   }
}

module.exports = new SmartContract();
