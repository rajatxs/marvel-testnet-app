import { generatePublicAddress } from "./utils/key.js";

/**
 * Verify account keys from request
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 * @param {import('express').NextFunction} next 
 */
export function validate(req, res, next) {
   const publicKey = req.header("X-Public-Key");
   const publicAddress = req.header("X-Public-Address");
   const txHash = req.header("X-Tx-Hash") || '';
   const txSign = req.header("X-Tx-Sign") || '';

   if (!(publicKey && publicAddress)) {
      return res.status(400).json({
         message: "Require credentials"
      });
   }

   if (generatePublicAddress(publicKey) !== publicAddress) {
      return res.status(400).json({
         message: "Invalid public key"
      });
   }

   Reflect.set(req, 'msg', {});
   Reflect.set(req['msg'], 'address', publicAddress);
   Reflect.set(req['msg'], 'publicKey', publicKey);
   Reflect.set(req['msg'], 'txHash', txHash);
   Reflect.set(req['msg'], 'txSign', txSign);

   next(null);
}

