import {UserEntity} from "../../domain/entities/user-entity.js";

function toEntity(doc) {
    if (!doc) return null;
    return new UserEntity({
        id: doc._id.toString(),
        email: doc.email,
        username: doc.username,
        password: doc.password,
        name: doc.name,
        avatar: doc.avatar,
        birthday: doc.birthday,
        biography: doc.biography,
        website: doc.website,
        settings: doc.settings,
        createdAt: doc.createdAt,
        lastLogin: doc.lastLogin,
        roles: doc.roles,
        status: doc.status,
    });
}

function toDatabase(entity) {
    return {
        email: entity.email,
        normalizedEmail: entity.email?.toLowerCase(),
        username: entity.username,
        normalizedUsername: entity.username?.toLowerCase(),
        password: entity.password,
        name: entity.name,
        avatar: entity.avatar,
        birthday: entity.birthday,
        biography: entity.biography,
        website: entity.website,
        settings: entity.settings,
        createdAt: entity.createdAt,
        lastLogin: entity.lastLogin,
        roles: entity.roles,
        status: entity.status,
    };
}

export {
    toEntity,
    toDatabase,
}