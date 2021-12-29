import { Router } from "express";
import { generateKeyPair, generatePublicAddress } from "../utils/key.js";

const router = Router();

router.get("/generate", (req, res) => {
   const keys = generateKeyPair();

   return res.status(200).json({
      message: "Key generated",
      keys
   });
});

router.post("/address", (req, res) => {
   const publicKey = req.body['publicKey'];
   const address = generatePublicAddress(publicKey || '');

   return res.status(200).json({
      address
   });
})

export default router;
