import { Router } from "express";

const router = Router();

router.post('/create', (req, res) => {
   const { body } = req;
   let tx, txHash = {};

   switch(body.type) {
      case 'TRANSFER':
         
         break;
   }

   return res.status(201).json({
      messsage: "Transaction created"
   });
});

export default router;
