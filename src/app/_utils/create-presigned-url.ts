"use server";

import { S3Client } from "@aws-sdk/client-s3";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { createHmac } from "crypto";
import { env } from "process";

export async function createPresignedUrl(duration: number = 10_000) {
  const key = env["BUFFR_SECRET"]!;
  const hmac = createHmac("sha256", key);
  const expires = new Date().getTime() + duration;
  const data = { expires };
  hmac.update(JSON.stringify(data));
  const hmacOutput = hmac.digest("hex");
  return `http://localhost:3000/api/uploads?alg=BFR1-HMAC-SHA256&key=${hmacOutput}&expires=${expires}`;
}

const client = new S3Client({
  region: "us-east-1", // ENV['AWS_REGION']
  credentials: { accessKeyId: "", secretAccessKey: "" }, // ENV['AWS_ACCESS_KEY_ID'] ENV['AWS_SECRET_ACCESS_KEY']
});

export async function presignS3Url(
  Bucket: string,
  Key: string,
  Expires: number
) {
  const c = createPresignedPost(client, { Bucket, Key, Expires });
}

// http://localhost:4566/my-bucket/mydoc.txt?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=localstack-id%2F20241004%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20241004T180353Z&X-Amz-Expires=60480&X-Amz-SignedHeaders=host&X-Amz-Signature=7cf5970e6690f1b1191d767d6f1a2630ba26d9c07991d30391063b2e6e83bcbe

// BFR1-HMAC-SHA256
