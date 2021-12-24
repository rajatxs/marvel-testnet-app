
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
   }
   toString() {
      return JSON.stringify(this);
   }
}

export default Transaction;
