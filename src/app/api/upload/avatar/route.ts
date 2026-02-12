import { validateRequest } from "@/auth";
import minioClient, { MINIO_BUCKET, MINIO_PUBLIC_URL } from "@/lib/minio";
import prisma from "@/lib/prisma";
import streamServerClient from "@/lib/stream";
import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file size (512KB max for avatar)
    if (file.size > 512 * 1024) {
      return NextResponse.json(
        { error: "File size exceeds 512KB" },
        { status: 400 },
      );
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Only image files are allowed" },
        { status: 400 },
      );
    }

    // Delete old avatar if exists
    if (user.avatarUrl) {
      try {
        const oldKey = user.avatarUrl.split(`${MINIO_BUCKET}/`)[1];
        if (oldKey) {
          await minioClient.send(
            new DeleteObjectCommand({
              Bucket: MINIO_BUCKET,
              Key: oldKey,
            }),
          );
        }
      } catch (error) {
        console.error("Error deleting old avatar:", error);
      }
    }

    // Generate unique filename
    const extension = file.name.split(".").pop();
    const filename = `avatars/${user.id}_${Date.now()}.${extension}`;

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

    // Update user avatar in database and Stream
    const newAvatarUrl = `${MINIO_PUBLIC_URL}/${MINIO_BUCKET}/${filename}`;
    await Promise.all([
      prisma.user.update({
        where: { id: user.id },
        data: {
          avatarUrl: newAvatarUrl,
        },
      }),
      streamServerClient.partialUpdateUser({
        id: user.id,
        set: {
          image: newAvatarUrl,
        },
      }),
    ]);

    return NextResponse.json({ avatarUrl: newAvatarUrl });
  } catch (error) {
    console.error("Avatar upload error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed" },
      { status: 500 },
    );
  }
}
