import { Router } from "express";
import { validate } from "../middlewares.js";
import contract from "../contract.js";
import Transaction from "../lib/Transaction.js";

const router = Router();

router.get('/', validate, (req, res) => {
   // @ts-ignore
   const address = req.msg.address;
   let txs = contract.transactionsOf(address);

   txs = txs.sort((tx1, tx2) => tx2.timestamp - tx1.timestamp);

   return res.status(200).json(txs);
});

router.post('/execute', validate, (req, res) => {
   const { body } = req;
   let result;

   switch(body.type) {
      case 'TRANSFER':
         // @ts-ignore
         const tx = new Transaction(req.msg.address, body.to, body.amount);
         const txHash = contract.$createTransaction(tx);
         const txSign = tx.sign(body.privateKey);

         result = contract.transfer(body.to, body.amount, {
            txHash,
            // @ts-ignore
            sender: req.msg.address,
            // @ts-ignore
            publicKey: req.msg.publicKey,
            txSign
         });
         break;
   }

   return res.status(201).json({
      message: "Transaction executed",
      result
   });
});

export default router;
