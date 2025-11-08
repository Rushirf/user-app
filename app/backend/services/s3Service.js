// services/s3Service.js
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const fs = require("fs");
const path = require("path");
const mime = require("mime-types");

// Load from .env or ConfigMap
const REGION = process.env.AWS_REGION || "us-east-1";
const BUCKET_NAME = process.env.S3_BUCKET_NAME;

// Create S3 client
const s3 = new S3Client({ region: REGION });

// Upload file to S3
const uploadToS3 = async (key, file) => {
  try {
    const fileStream = fs.createReadStream(file.path);
    const contentType = mime.lookup(file.originalname) || "application/octet-stream";

    const uploadParams = {
      Bucket: BUCKET_NAME,
      Key: key,
      Body: fileStream,
      ContentType: contentType,
      ACL: "public-read", // optional; makes file accessible via URL
    };

    console.log(`[+] Uploading ${file.originalname} to S3...`);
    await s3.send(new PutObjectCommand(uploadParams));

    // Construct S3 public URL
    const fileUrl = `https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/${key}`;
    console.log(`[+] Uploaded successfully: ${fileUrl}`);
    return fileUrl;
  } catch (err) {
    console.error("[-] S3 Upload failed:", err);
    throw err;
  } finally {
    // Clean up local file
    fs.unlink(file.path, (err) => {
      if (err) console.error("Failed to delete temp file:", err);
    });
  }
};

module.exports = { uploadToS3 };
