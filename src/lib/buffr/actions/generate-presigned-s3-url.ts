"use server";
import { S3, S3ClientConfig } from "@aws-sdk/client-s3";

import { createPresignedPost } from "@aws-sdk/s3-presigned-post";

const accessKeyId = process.env.S3_ACCESS_KEY_ID!;
const secretAccessKey = process.env.S3_SECRET_KEY!;
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

export async function generatePresignedS3Url(
  formData: FormData,
  customKey?: string
) {
  const file = formData.get("file") as File;
  // todo check assumptions
  const r = await createPresignedPost(client, {
    Bucket,
    Key: customKey || file.name,
    Fields: {},
    Expires: 10_000,
  });
  return { url: r.url, headers: r.fields };
}
