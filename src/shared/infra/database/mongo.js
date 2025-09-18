import mongoose from 'mongoose';
import {appConfig} from "../../../config/app-config.js";
import {loggerHelper} from "../../utils/logger-helper.js";

const connectToMongoDB = async () => {
    try {
        await mongoose.connect(appConfig.database.uri,
            {
                dbName: appConfig.database.name,
            });
        loggerHelper.info('MongoDB connected');
    } catch (err) {
        loggerHelper.error('Connect To DB Failure', {error: err});
        process.exit(1);
    }
}

export default connectToMongoDB;
