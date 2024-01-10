const { randomBytes } = require("crypto");
const newPrivateKey = `0x${randomBytes(32).toString("hex")}`;
console.log("newPrivateKey",newPrivateKey)


