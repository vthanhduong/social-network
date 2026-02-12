import { validateRequest } from "@/auth";
import minioClient, { MINIO_BUCKET, MINIO_PUBLIC_URL } from "@/lib/minio";
import prisma from "@/lib/prisma";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    if (files.length > 5) {
      return NextResponse.json(
        { error: "Maximum 5 files allowed" },
        { status: 400 },
      );
    }

    const uploadResults = await Promise.all(
      files.map(async (file) => {
        // Validate file size
        const maxSize = file.type.startsWith("video") ? 64 * 1024 * 1024 : 4 * 1024 * 1024; // 64MB for video, 4MB for images
        if (file.size > maxSize) {
          throw new Error(`File ${file.name} exceeds maximum size`);
        }

        // Generate unique filename
        const extension = file.name.split(".").pop();
        const filename = `attachments/${Date.now()}_${crypto.randomUUID()}.${extension}`;

        // Convert file to buffer
        const buffer = Buffer.from(await file.arrayBuffer());

        // Upload to MinIO
        await minioClient.send(
          new PutObjectCommand({
            Bucket: MINIO_BUCKET,
            Key: filename,
            Body: buffer,
            ContentType: file.type,
          }),
        );

        // Create media record in database
        const url = `${MINIO_PUBLIC_URL}/${MINIO_BUCKET}/${filename}`;
        const media = await prisma.media.create({
          data: {
            url,
            type: file.type.startsWith("image") ? "IMAGE" : "VIDEO",
          },
        });

        return {
          name: file.name,
          mediaId: media.id,
          url,
        };
      }),
    );

    return NextResponse.json({ results: uploadResults });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed" },
      { status: 500 },
    );
  }
}
