import { Router } from "express";
import { generateKeyPair, generatePublicAddress } from "../utils/key.js";

const router = Router();

router.get("/generate", (req, res) => {
   const keys = generateKeyPair();
   const address = generatePublicAddress(keys.publicKey);

   return res.status(200).json({
      message: "Key generated",
      result: Object.assign({ address }, keys)
   });
});

export default router;
