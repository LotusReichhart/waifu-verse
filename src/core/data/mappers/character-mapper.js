import {CharacterEntity} from "../../domain/entities/character-entity.js";

function toEntity(doc) {
    if (!doc) return null;
    return new CharacterEntity({
        id: doc._id.toString(),
        name: doc.name,
        slug: doc.slug,
        gender: doc.gender,
        avatar: doc.avatar,
        creator: doc.creator, // có thể là ObjectId hoặc UserEntity khi populate
        hearts: doc.hearts,
        views: doc.views,
        createdAt: doc.createdAt,
        status: doc.status
    });
}

function toDatabase(entity) {
    return {
        name: entity.name,
        slug: entity.slug,
        gender: entity.gender,
        avatar: entity.avatar,
        creator: entity.creator,
        hearts: entity.hearts,
        views: entity.views,
        createdAt: entity.createdAt,
        status: entity.status
    };
}

export {
    toEntity,
    toDatabase,
}
