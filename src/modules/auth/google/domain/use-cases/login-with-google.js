import {AppError} from "../../../../../shared/utils/app-error.js";

export class LoginWithGoogleUseCase {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async execute(id) {

        try {
            const user = await this.userRepository.getById({userId: id});
            if (!user) throw new AppError({key: "global", code: "accountNotExits", status: 404});

            user.lastLogin = new Date();
            await this.userRepository.update({userEntity: user});

            return {user: user};
        } catch (err) {
            console.log('LoginWithGoogle err: ', err);
            if (err instanceof AppError) throw err;
            throw new AppError({});
        }
    }
}