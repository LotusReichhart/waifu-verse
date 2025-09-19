import {S3Client} from "@aws-sdk/client-s3";
import {appConfig} from "../../../config/app-config.js";

export const s3 = new S3Client({
    region: appConfig.aws.region,
    credentials: {
        accessKeyId: appConfig.aws.access,
        secretAccessKey: appConfig.aws.secret
    }
});
