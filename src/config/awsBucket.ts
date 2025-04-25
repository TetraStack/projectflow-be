import { env } from "@/env";
import { S3Client } from "@aws-sdk/client-s3";

export const mys3Client = new S3Client(
    { region: env.AWS_BUCKETREGION, credentials: { accessKeyId: env.AWS_ACCESSTOKEN, secretAccessKey: env.AWS_SECRETKEY } },
);