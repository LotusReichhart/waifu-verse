import mongoose from "mongoose";
import {USER_STATUS, USER_STATUSES} from "../../../shared/utils/schema-status.js";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    normalizedEmail: {
        type: String,
        unique: true,
        index: true,
    },
    username: {
        type: String,
        unique: true,
        trim: true,
    },
    normalizedUsername: {
        type: String,
        unique: true,
        index: true,
    },
    password: {
        type: String,
        trim: true,
    },
    name: {
        type: String,
    },
    avatar: {
        type: String,
    },
    birthday: {
        type: Date,
    },
    biography: {
        type: String
    },
    website: {
        type: String,
        trim: true,
    },
    settings: {
        lang: {
            type: String,
        },
        theme: {
            type: String,
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastLogin: {
        type: Date,
        default: Date.now
    },
    roles: {
        type: [String],
        enum: ['user', 'collaborator', 'admin'],
        default: ['user']
    },
    status: {
        type: String,
        enum: USER_STATUSES,
        default: USER_STATUS.ACTIVE,
    }
});

userSchema.pre("save", function (next) {
    if (this.email) this.normalizedEmail = this.email.toLowerCase();
    if (this.username) this.normalizedUsername = this.username.toLowerCase();
    next();
});

const UserModel = mongoose.model('User', userSchema);
export default UserModel;
