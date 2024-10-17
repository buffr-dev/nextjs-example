import { S3, S3ClientConfig } from "@aws-sdk/client-s3";

import { createPresignedPost } from "@aws-sdk/s3-presigned-post";

const accessKeyId = process.env.AWS_ACCESS_KEY_ID!;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY!;
const region = process.env.S3_REGION;
const Bucket = process.env.S3_BUCKET;

// const myHttpHandler = new MyHttpHandler();
// myHttpHandler.onProgress$.subscribe(progress => {
//   const percentComplete = progress.progressEvent.loaded / progress.progressEvent.total * 100;
//   console.log('upload progress', percentComplete);
// });

const clientOptions: S3ClientConfig = {
  region,
  credentials: { accessKeyId, secretAccessKey },
};

if (process.env.S3_DEV_URL) {
  clientOptions.forcePathStyle = true;
  clientOptions.endpoint = process.env.S3_DEV_URL;
}

const client = new S3(clientOptions);

// export async function uploadFile(
//   key: string,
//   file: Buffer,
//   options?: Partial<Omit<PutObjectRequest, "Bucket" | "Key" | "Body">>
// ) {
//   const cmd = new PutObjectCommand({
//     Bucket,
//     Key: key,
//     Body: file,
//     ...options,
//   });
//   // client.
//   return client.send(cmd);
// }

export function presignUrl() {
  createPresignedPost(client, {
    Bucket: "",
    Key: "",
    Fields: {},
    Expires: 100,
  });
}
