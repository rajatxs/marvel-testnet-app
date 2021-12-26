import express from 'express';
import path from "path";
import { rootDir } from "./config.js";
// import { validate } from "./middlewares.js";
// import keyRoutes from "./routes/key.js";

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(express.json());
// app.use("/key", keyRoutes);

app.get('/', (req, res) => {
   res.sendFile(path.join(rootDir, "index.html"));
});

// app.get('/balance', validate, (req, res) => {
//    let balance = 0; //contract.balanceOf();

//    return res.status(200).json({
//       value: balance
//    });
// });
app.get('/balance', (req, res) => {
   let balance = 0; //contract.balanceOf();

   return res.status(200).json({
      value: balance
   });
});

app.listen(port, () => {
   console.log("Server is running on port ", port);
});
