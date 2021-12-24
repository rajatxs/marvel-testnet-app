import crypto from "crypto";

/** Generate account keys */
export function generateKeyPair() {
   const keypair = crypto.generateKeyPairSync("rsa", {
      modulusLength: 1024,
      publicKeyEncoding: { type: "spki", format: "pem" },
      privateKeyEncoding: { type: "pkcs8", format: "pem" },
   });

   return keypair;
}

/**
 * Generate public address from public key
 * @param {string} publicKey
 */
export function generatePublicAddress(publicKey) {
   const hash = crypto.createHash("SHA1");
   hash.update(publicKey).end();

   return hash.digest("hex");
}

/**
 * Generate SHA256 Hash
 * @param {any} data 
 */
export function generateSHA256Hash(data) {
   const hash = crypto.createHash("SHA256");
   hash.update(data).end();
   return hash.digest('hex');
}

/**
 * Create SHA256 signature
 * @param {string} hash 
 * @param {string} privateKey 
 */
export function createSHA256Signature(hash, privateKey) {
   const signer = crypto.createSign("SHA256");
   signer.update(hash).end();

   return signer.sign(privateKey);
}

/**
 * Verify SHA256 hash with public key and signature
 * @param {string} hash 
 * @param {string} publicKey 
 * @param {any} signature 
 */
export function verifySHA256Hash(hash, publicKey, signature) {
   const verifier = crypto.createVerify("SHA256");
   verifier.update(hash);

   return verifier.verify(publicKey, signature);
}
