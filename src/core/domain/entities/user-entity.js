import {USER_STATUS} from "../../../shared/utils/schema-status.js";

export class UserEntity {
    constructor({
                    id,
                    email,
                    username,
                    password,
                    name,
                    avatar,
                    birthday,
                    biography,
                    website,
                    settings,
                    createdAt,
                    lastLogin,
                    roles,
                    status,
                }) {
        this.id = id;
        this.email = email;
        this.username = username;
        this.password = password;
        this.name = name;
        this.avatar = avatar;
        this.birthday = birthday;
        this.biography = biography;
        this.website = website;
        this.settings = settings || {};
        this.createdAt = createdAt || new Date();
        this.lastLogin = lastLogin || new Date();
        this.roles = roles || ['user'];
        this.status = status || USER_STATUS.ACTIVE;
    }

    isAdmin() {
        return this.roles.includes('admin');
    }

    canCollaborate() {
        return ['admin', 'collaborator'].some(r => this.roles.includes(r));
    }

    toPublicInfo() {
        return {
            username: this.username,
            name: this.name,
            avatar: this.avatar
        };
    }
}
