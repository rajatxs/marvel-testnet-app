import crypto from "crypto";

/** Generate account keys */
export function generateKeyPair() {
   const keypair = crypto.generateKeyPairSync("rsa", {
      modulusLength: 512,
      publicKeyEncoding: { type: "spki", format: "der" },
      privateKeyEncoding: { type: "pkcs8", format: "der" },
   });

   return keypair;
}

/**
 * Convert to private key object
 * @param {string} privateKey 
 */
export function toPrivateKey(privateKey) {
   return crypto.createPrivateKey({
      key: Buffer.from(privateKey, 'hex'),
      format: 'der',
      type: 'pkcs8'
   });
}

/**
 * Convert to public key object
 * @param {string} publicKey 
 */
export function toPublicKey(publicKey) {
   return crypto.createPublicKey({
      key: Buffer.from(publicKey, 'hex'),
      format: 'der',
      type: 'spki'
   });
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
 * @param {import('crypto').KeyObject} privateKey 
 */
export function createSHA256Signature(hash, privateKey) {
   const signer = crypto.createSign("SHA256");
   signer.update(hash).end();

   return signer.sign(privateKey, 'hex');
}

/**
 * Verify SHA256 hash with public key and signature
 * @param {string} hash 
 * @param {import('crypto').KeyObject} publicKey 
 * @param {string} signature 
 */
export function verifySHA256Hash(hash, publicKey, signature) {
   const verifier = crypto.createVerify("SHA256");
   verifier.update(hash);

   return verifier.verify(publicKey, Buffer.from(signature, 'hex'));
}
