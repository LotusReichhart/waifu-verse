import dotenvFlow from "dotenv-flow";
dotenvFlow.config();

export const env = {
    nodeEnv: process.env.NODE_ENV,

    port: process.env.PORT,
    baseDomain: process.env.BASE_DOMAIN,

    mongoDb: process.env.MONGO_DB,
    dbName: process.env.DB_NAME,

    awsRegion: process.env.AWS_REGION,
    awsAccessKey: process.env.AWS_ACCESS_KEY_ID,
    awsSecretKey: process.env.AWS_SECRET_ACCESS_KEY,
    s3Bucket: process.env.S3_BUCKET_NAME,

    jwtSecret: process.env.JWT_SECRET,
    sessionSecret: process.env.SESSION_SECRET,

    google: {
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackDev: process.env.GOOGLE_CALLBACK_DEV,
    },

    redis: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        password: process.env.REDIS_PASSWORD,
    },

    email: {
        user: process.env.EMAIL_USER,
        password: process.env.EMAIL_PASSWORD,
    },
};
