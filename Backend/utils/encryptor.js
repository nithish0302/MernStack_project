const crypto = require("crypto");

const algorithm = "aes-256-cbc";
const secretKey = Buffer.from(process.env.ENCRYPTION_SECRET, "utf-8"); // 32 bytes
const iv = Buffer.from("1234567890123456", "utf-8"); // 16 bytes (static for testing)

function encrypt(text) {
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
}

function decrypt(encryptedText) {
  const decipher = crypto.createDecipheriv(algorithm, secretKey, iv);
  let decrypted = decipher.update(encryptedText, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

module.exports = { encrypt, decrypt };
