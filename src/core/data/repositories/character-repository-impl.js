import {CharacterRepository} from "../../domain/repositories/character-repository.js";
import CharacterModel from "../models/character-schema.js";
import {CHARACTER_STATUS} from "../../../shared/utils/schema-status.js";
import {loggerHelper} from "../../../shared/utils/logger-helper.js";
import {toDatabase, toEntity} from "../mappers/character-mapper.js";

export class CharacterRepositoryImpl extends CharacterRepository {
    async getListCharacters({q = '', genders = [], sort = 'createdAt-desc', page = 1, limit = 20}) {
        const filter = {status: CHARACTER_STATUS.ENABLE};

        if (q) {
            filter.normalizedName = {$regex: q, $options: 'i'};
        }

        if (genders.length > 0) {
            filter.gender = {$in: genders};
        }

        let sortOption = {createdAt: -1};
        switch (sort) {
            case 'name-asc':
                sortOption = {normalizedName: 1};
                break;
            case 'name-desc':
                sortOption = {normalizedName: -1};
                break;
            case 'createdAt-asc':
                sortOption = {createdAt: 1};
                break;
            case 'createdAt-desc':
                sortOption = {createdAt: -1};
                break;
        }

        const skip = (page - 1) * limit;

        const [total, items] = await Promise.all([
            CharacterModel.countDocuments(filter),
            CharacterModel.find(filter)
                .select('_id name gender slug avatar')
                .sort(sortOption)
                .skip(skip)
                .limit(limit)
                .lean()
        ]);

        return {total, items};
    }

    async getById({characterId}) {
        try {
            const doc = await CharacterModel.findById(characterId);
            return toEntity(doc);
        } catch (err) {
            loggerHelper.error(`CharacterRepositoryImpl.getById error: ${err.message}`, {stack: err.stack});
            throw new Error("getCharacterFailedError");
        }
    }

    async getBySlug({slug}) {
        try {
            const doc = await CharacterModel.findOne({slug: slug});
            return toEntity(doc);
        } catch (err) {
            loggerHelper.error(`CharacterRepositoryImpl.getBySlug error: ${err.message}`, {stack: err.stack});
            throw new Error("getCharacterFailedError");
        }
    }

    async create({characterEntity}) {
        try {
            const data = toDatabase(characterEntity);
            const doc = new CharacterModel(data);
            const saved = await doc.save();
            return toEntity(saved);
        } catch (err) {
            loggerHelper.error(`CharacterRepositoryImpl.create error: ${err.message}`, {stack: err.stack});
            throw new Error("createCharacterFailedError");
        }
    }

    async update({characterEntity}) {
        try {
            const data = toDatabase(characterEntity);

            const updatedDoc = await CharacterModel.findByIdAndUpdate(
                characterEntity.id,
                { $set: data },
                { new: true }
            );

            if (!updatedDoc) {
                throw new Error("updateCharacterFailedError");
            }

            return toEntity(updatedDoc);
        } catch (err) {
            loggerHelper.error(`CharacterRepositoryImpl.update error: ${err.message}`, {stack: err.stack});
            throw new Error("updateCharacterFailedError");
        }
    }
}