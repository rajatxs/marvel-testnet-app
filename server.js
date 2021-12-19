const express = require('express');
const contract = require("./contract");
const path = require("path");

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(express.json());

app.get('/', (req, res) => {
   res.sendFile(path.join(__dirname, "index.html"));
});

contract.transfer("rajat", "pruthvi", 140);

app.get('/balance/:addr', (req, res) => {
   const address = req.params.addr;
   let balance = contract.balanceOf(address);

   return res.status(200).json({
      value: balance
   });
});

app.get('/transactions/:addr', (req, res) => {
   const address = req.params.addr;
   let transactions = contract.transactionsOf(address);

   return res.status(200).json({
      value: transactions
   });
})

app.post('/transfer', (req, res) => {
   const data = req.body;
   contract.transfer(data.from, data.to, data.amount);

   return res.status(200).json({
      message: "Transaction executed"
   });
});

app.listen(port, () => {
   console.log("Server is running on port ", port);
});
