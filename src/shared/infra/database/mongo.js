import mongoose from 'mongoose';
import {appConfig} from "../../../config/app-config.js";

const connectToMongoDB = async () => {
    try {
        await mongoose.connect(appConfig.database.uri,
            {
                dbName: appConfig.database.name,
            });
        console.log('MongoDB connected');
    } catch (err) {
        console.log('Connect To DB Failure: ', err);
        process.exit(1);
    }
}

export default connectToMongoDB;