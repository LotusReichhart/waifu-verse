import {isEmail, isEmpty} from "../../../../../shared/utils/text-validator.js";
import {AppError} from "../../../../../shared/utils/app-error.js";
import argon2 from "argon2";
import {loggerHelper} from "../../../../../shared/utils/logger-helper.js";

export class LoginWithUsernameOrEmailUseCase {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async execute({input, password}) {
        if (isEmpty(input)) throw new AppError({key: "input", code: "emailOrUsernameEmpty", status: 400});
        if (isEmpty(password)) throw new AppError({key: "password", code: "passwordEmpty", status: 400});

        try {
            let user;
            if (isEmail(input)) {
                user = await this.userRepository.getByEmail({email: input});
                if (!user) throw new AppError({key: "input", code: "emailNotRegistered", status: 404});
            } else {
                user = await this.userRepository.getByUsername({username: input});
                if (!user) throw new AppError({key: "input", code: "accountNotExits", status: 404});
            }

            const isValid = user.password && await argon2.verify(user.password, password);
            if (!isValid) throw new AppError({key: "password", code: "incorrectPassword", status: 409});

            user.lastLogin = new Date();
            await this.userRepository.update({userEntity: user});

            return {user: user};
        } catch (err) {
            loggerHelper.error('loginWithUsernameOrEmail err', {error: err});
            if (err instanceof AppError) throw err;
            throw new AppError({});
        }
    }
}
