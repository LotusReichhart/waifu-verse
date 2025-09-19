import {env} from "./env.js";

export const appConfig = {
    environment: env.nodeEnv,
    server: {
        port: env.port || 3000,
        domain: env.baseDomain || "http://localhost:8080",
    },
    database: {
        uri: env.mongoDb,
        name: env.dbName
    },
    aws: {
        region: env.awsRegion,
        access: env.awsAccessKey,
        secret: env.awsSecretKey,
        bucket: env.s3Bucket,
    },
    auth: {
        jwtSecret: env.jwtSecret,
        sessionSecret: env.sessionSecret,
    },
    google: env.google,
    redis: env.redis,
    email: env.email,
};
