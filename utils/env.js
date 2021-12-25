
const env = {
   get ownerAddress() {
      return process.env.OWNER_ADDRESS;
   },
   get ownerPublicKey() {
      return process.env.OWNER_PUBLIC_KEY;
   },
   get ownerPrivateKey() {
      return process.env.OWNER_PRIVATE_KEY;
   }
}

export default env;
