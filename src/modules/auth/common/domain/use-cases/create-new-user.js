import {UserEntity} from "../../../../../core/domain/entities/user-entity.js";

export class CreateNewUserUseCase {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async execute({email, username, password, avatar, name}) {
        const userEntity = new UserEntity({
            email: email,
            username: username,
            password: password,
            avatar: avatar,
            name: name
        });

        return await this.userRepository.create({userEntity: userEntity});
    }
}