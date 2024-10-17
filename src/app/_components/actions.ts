"use server";
import { S3, S3ClientConfig } from "@aws-sdk/client-s3";

import { createPresignedPost } from "@aws-sdk/s3-presigned-post";

const accessKeyId = process.env.AWS_ACCESS_KEY_ID!;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY!;
const region = process.env.S3_REGION;
const Bucket = process.env.S3_BUCKET!;

const clientOptions: S3ClientConfig = {
  region,
  credentials: { accessKeyId, secretAccessKey },
};

if (process.env.S3_DEV_URL) {
  clientOptions.forcePathStyle = true;
  clientOptions.endpoint = process.env.S3_DEV_URL;
}

const client = new S3(clientOptions);

export async function generatePresignedUrl(file: File) {
  const r = await createPresignedPost(client, {
    Bucket,
    Key: file.name,
    Fields: {},
    Expires: 10_000,
  });

  return { url: r.url };
}
