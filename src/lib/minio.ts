import { S3Client } from "@aws-sdk/client-s3";

const minioClient = new S3Client({
  endpoint: `https://${process.env.MINIO_ENDPOINT}`,
  region: "us-east-1", // MinIO doesn't care about region
  credentials: {
    accessKeyId: process.env.MINIO_ACCESS_KEY!,
    secretAccessKey: process.env.MINIO_SECRET_KEY!,
  },
  forcePathStyle: true, // Important for MinIO
});

export const MINIO_BUCKET = process.env.MINIO_BUCKET!;
export const MINIO_PUBLIC_URL = process.env.NEXT_PUBLIC_MINIO_PUBLIC_URL!;

export default minioClient;
