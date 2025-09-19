import {UserRepository} from "../../domain/repositories/user-repository.js";
import {toDatabase, toEntity} from "../mappers/user-mapper.js";
import UserModel from "../models/user-schema.js";
import {loggerHelper} from "../../../shared/utils/logger-helper.js";

export class UserRepositoryImpl extends UserRepository {
    async getById({userId}) {
        try {
            const doc = await UserModel.findById(userId);
            return toEntity(doc);
        } catch (err) {
            loggerHelper.error(`UserRepositoryImpl.getById error: ${err.message}`, { stack: err.stack });
            throw new Error("getUserFailedError");
        }
    }

    async getByUsername({username}) {
        try {
            const doc = await UserModel.findOne({ normalizedUsername: username.toLowerCase() });
            return toEntity(doc);
        } catch (err) {
            loggerHelper.error(`UserRepositoryImpl.getByUsername error: ${err.message}`, { stack: err.stack });
            throw new Error("getUserFailedError");
        }
    }

    async getByEmail({email}) {
        try {
            const doc = await UserModel.findOne({ normalizedEmail: email.toLowerCase() });
            return toEntity(doc);
        } catch (err) {
            loggerHelper.error(`UserRepositoryImpl.getByEmail error: ${err.message}`, { stack: err.stack });
            throw new Error("getUserFailedError");
        }
    }

    async create({userEntity}) {
        try {
            const data = toDatabase(userEntity);
            const doc = new UserModel(data);
            const saved = await doc.save();
            return toEntity(saved);
        } catch (err) {
            loggerHelper.error(`UserRepositoryImpl.create error: ${err.message}`, { stack: err.stack });
            throw new Error("createUserFailedError");
        }
    }

    async update({userEntity}) {
        try {
            const data = toDatabase(userEntity);

            const updatedDoc = await UserModel.findByIdAndUpdate(
                userEntity.id,
                { $set: data },
                { new: true }
            );

            if (!updatedDoc) {
                throw new Error("updateUserFailedError");
            }

            return toEntity(updatedDoc);
        } catch (err) {
            loggerHelper.error(`UserRepositoryImpl.update error: ${err.message}`, { stack: err.stack });
            throw new Error("updateUserFailedError");
        }
    }
}
