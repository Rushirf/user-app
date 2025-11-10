const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const { SecretsManagerClient, GetSecretValueCommand } = require("@aws-sdk/client-secrets-manager");

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Routes
app.use("/users", require("./routes/userRoute"));

// Function to fetch secrets from AWS Secrets Manager
async function getSecrets() {
  const region = "us-east-1";
  const secretName = process.env.AWS_SECRET_NAME || "myAppSecrets";

  const client = new SecretsManagerClient({ region });

  try {
    console.log("[+] Fetching secrets from AWS Secrets Manager...");
    const response = await client.send(new GetSecretValueCommand({ SecretId: secretName }));

    if ("SecretString" in response) {
      return JSON.parse(response.SecretString);
    } else {
      throw new Error("SecretString not found in AWS response");
    }
  } catch (err) {
    console.error("[-] Failed to fetch secrets:", err);
    throw err;
  }
}

// Main initialization
(async () => {
  try {
    // Fetch secrets (MONGO_URI & JWT_SECRET)
    const secrets = await getSecrets();

    // Merge with non-sensitive env vars
    const PORT = process.env.PORT || 8080;
    const MONGO_URI = secrets.MONGO_URI;
    const JWT_SECRET = secrets.JWT_SECRET;

    // Set JWT secret in process env for downstream usage
    process.env.JWT_SECRET = JWT_SECRET;

    console.log("[+] Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("[+] MongoDB connection successful");

    app.listen(PORT, () => {
      console.log(`[+] Server running on port ${PORT}`);
      console.log(`[+] Environment: ${process.env.NODE_ENV || "development"}`);
      console.log(`[+] S3 Bucket: ${process.env.S3_BUCKET_NAME || "Not configured"}`);
    });
  } catch (e) {
    console.error("[-] Initialization failed:", e);
    process.exit(1);
  }
})();

// remote it later