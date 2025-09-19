import mongoose from 'mongoose';
import {CHARACTER_STATUS, CHARACTER_STATUSES} from "../../../shared/utils/schema-status.js";

const {Schema} = mongoose;
const {ObjectId} = Schema.Types;

const characterSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    normalizedName: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other'],
        default: 'other',
    },
    avatar: {
        type: String,
    },
    creator: {
        type: ObjectId,
        required: true,
        ref: 'User',
    },
    hearts: {type: Number, default: 0},
    views: {type: Number, default: 0},
    createdAt: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: CHARACTER_STATUSES,
        default: CHARACTER_STATUS.PENDING,
    }
});

characterSchema.pre('validate', function (next) {
    if (this.name) this.normalizedName = this.name.toLowerCase();
    next();
});

const CharacterModel = mongoose.model('Character', characterSchema);
export default CharacterModel;
