import 'dotenv/config';
import express from 'express';
import path from "path";
import { rootDir } from "./config.js";
import { validate } from "./middlewares.js";
import keyRoutes from "./routes/key.js";
import contract from "./contract.js";

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(express.json());
app.use("/key", keyRoutes);

app.get('/', (req, res) => {
   res.sendFile(path.join(rootDir, "index.html"));
});

app.get('/balance', validate, (req, res) => {
   // @ts-ignore
   let balance = contract.balanceOf(req.msg.address);

   return res.status(200).json({
      value: balance
   });
});

app.use((error, req, res, next) => {
   console.log("INTERNAL SERVER ERROR", error);

   return res.status(500).send({
      message: "Something went wrong"
   });
})

app.listen(port, () => {
   console.log("Server is running on port ", port);
});
