import {UserRepository} from "../../domain/repositories/user-repository.js";
import {toDatabase, toEntity} from "../mappers/user-mapper.js";
import UserModel from "../models/user-schema.js";

export class UserRepositoryImpl extends UserRepository {
    async getById({userId}) {
        try {
            const doc = await UserModel.findById(userId);
            return toEntity(doc);
        } catch (err) {
            console.log("getById error", err);
            throw new Error("getUserFailedError");
        }
    }

    async getByUsername({username}) {
        try {
            const doc = await UserModel.findOne({normalizedUsername: username.toLowerCase()});
            return toEntity(doc);
        } catch (err) {
            console.log("getByUsername error", err);
            throw new Error("getUserFailedError");
        }
    }

    async getByEmail({email}) {
        try {
            const doc = await UserModel.findOne({normalizedEmail: email.toLowerCase()});
            return toEntity(doc);
        } catch (err) {
            console.log("getByEmail error", err);
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
            console.log("create error", err);
            throw new Error("createUserFailedError");
        }
    }

    async update({userEntity}) {
        try {
            const data = toDatabase(userEntity);

            const updatedDoc = await UserModel.findByIdAndUpdate(
                userEntity.id,
                {$set: data},
                {new: true}
            );

            if (!updatedDoc) {
                throw new Error("updateUserFailedError");
            }

            return toEntity(updatedDoc);
        } catch (err) {
            console.log("update error", err);
            throw new Error("updateUserFailedError");
        }
    }
}