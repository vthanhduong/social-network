import { S3Client, CreateBucketCommand, PutBucketPolicyCommand, PutBucketCorsCommand } from "@aws-sdk/client-s3";
import { config } from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env file
config({ path: join(__dirname, "..", ".env") });

const minioClient = new S3Client({
  endpoint: `https://${process.env.MINIO_ENDPOINT}`,
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.MINIO_ACCESS_KEY,
    secretAccessKey: process.env.MINIO_SECRET_KEY,
  },
  forcePathStyle: true,
});

const BUCKET = process.env.MINIO_BUCKET;

async function setupBucket() {
  try {
    // Create bucket if it doesn't exist
    try {
      await minioClient.send(
        new CreateBucketCommand({
          Bucket: BUCKET,
        })
      );
      console.log(`✅ Bucket '${BUCKET}' created successfully`);
    } catch (error) {
      if (error.name === "BucketAlreadyOwnedByYou" || error.name === "BucketAlreadyExists") {
        console.log(`✅ Bucket '${BUCKET}' already exists`);
      } else {
        throw error;
      }
    }

    // Set bucket policy to allow public read
    const bucketPolicy = {
      Version: "2012-10-17",
      Statement: [
        {
          Effect: "Allow",
          Principal: "*",
          Action: ["s3:GetObject"],
          Resource: [`arn:aws:s3:::${BUCKET}/*`],
        },
      ],
    };

    await minioClient.send(
      new PutBucketPolicyCommand({
        Bucket: BUCKET,
        Policy: JSON.stringify(bucketPolicy),
      })
    );
    console.log(`✅ Public read policy set for bucket '${BUCKET}'`);

    // Note: CORS configuration might not be supported by MinIO via S3 API
    // Configure CORS manually in MinIO console if needed
    try {
      await minioClient.send(
        new PutBucketCorsCommand({
          Bucket: BUCKET,
          CORSConfiguration: {
            CORSRules: [
              {
                AllowedOrigins: ["*"],
                AllowedMethods: ["GET", "HEAD"],
                AllowedHeaders: ["*"],
                MaxAgeSeconds: 3600,
              },
            ],
          },
        })
      );
      console.log(`✅ CORS configuration set for bucket '${BUCKET}'`);
    } catch (corsError) {
      console.log(`⚠️  CORS configuration skipped (may need manual setup in MinIO console)`);
    }

    console.log("\n🎉 MinIO bucket setup completed successfully!");
  } catch (error) {
    console.error("❌ Error setting up MinIO bucket:", error);
    process.exit(1);
  }
}

setupBucket();
