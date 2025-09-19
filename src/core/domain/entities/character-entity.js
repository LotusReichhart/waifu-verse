import {CHARACTER_STATUS} from "../../../shared/utils/schema-status.js";

export class CharacterEntity {
    constructor({
                    id,
                    name,
                    slug,
                    gender = "other",
                    avatar,
                    creator,
                    hearts = 0,
                    views = 0,
                    createdAt = new Date(),
                    status = CHARACTER_STATUS.PENDING
                }) {
        this.id = id;
        this.name = name;
        this.slug = slug;
        this.gender = gender;
        this.avatar = avatar;
        this.creator = creator;
        this.hearts = hearts;
        this.views = views;
        this.createdAt = createdAt;
        this.status = status;
    }

    toPublicInfo() {
        return {
            name: this.name,
            slug: this.slug,
            avatar: this.avatar,
            hearts: this.hearts,
            views: this.views
        };
    }
}
