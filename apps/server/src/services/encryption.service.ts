import crypto from "crypto";

export class EncryptionService {
  private algorithm = "aes-256-gcm";
  private key: Buffer;

  constructor() {
    const encryptionKey = process.env.ENCRYPTION_KEY;

    if (!encryptionKey) {
      throw new Error("ENCRYPTION_KEY must be set in environment variables");
    }

    if (encryptionKey.length < 32) {
      throw new Error(
        "ENCRYPTION_KEY must be at least 32 characters long (64 hex characters)"
      );
    }

    try {
      this.key = crypto.scryptSync(encryptionKey, "salt", 32);
    } catch (error) {
      throw new Error(
        `Failed to derive encryption key: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  encrypt(apiKey: string): string {
    const iv = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv(this.algorithm, this.key, iv) as any;

    let encrypted = cipher.update(apiKey, "utf8", "hex");
    encrypted += cipher.final("hex");

    const authTag = cipher.getAuthTag();

    return `${iv.toString("hex")}:${encrypted}:${authTag.toString("hex")}`;
  }

  decrypt(encryptedKey: string): string {
    try {
      const parts = encryptedKey.split(":");
      if (parts.length !== 3) {
        throw new Error("Invalid encrypted key format");
      }

      const iv = Buffer.from(parts[0]!, "hex");
      const encrypted = parts[1]!;
      const authTag = Buffer.from(parts[2]!, "hex");

      const decipher = crypto.createDecipheriv(
        this.algorithm,
        this.key,
        iv
      ) as any;
      decipher.setAuthTag(authTag);

      let decrypted = decipher.update(encrypted, "hex", "utf8");
      decrypted += decipher.final("utf8");

      return decrypted;
    } catch (error) {
      throw new Error("Failed to decrypt API key");
    }
  }
}

export const encryptionService = new EncryptionService();
