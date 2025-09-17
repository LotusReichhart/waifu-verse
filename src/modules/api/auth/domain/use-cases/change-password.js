import {AppError} from "../../../../../shared/utils/app-error.js";
import {isEmpty, isTooShort} from "../../../../../shared/utils/text-validator.js";
import argon2 from "argon2";

export class ChangePasswordUseCase {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async execute({email, password, confirmPassword}) {
        if (isEmpty(email)) {
            throw new AppError({key: "global", code: "doNotHavePasswordPermission", status: 401});
        }

        if (isEmpty(password)) {
            throw new AppError({key: "password", code: "passwordEmpty", status: 400});
        } else if (isTooShort(password, 8)) {
            throw new AppError({key: "password", code: "passwordTooShort", status: 400});
        }

        if (isEmpty(confirmPassword)) {
            throw new AppError({key: "confirmPassword", code: "confirmPasswordEmpty", status: 400});
        } else if (confirmPassword !== password) {
            throw new AppError({key: "confirmPassword", code: "confirmPasswordMismatch", status: 400});
        }

        try {
            const user = await this.userRepository.getByEmail({email: email});
            if (!user) throw new AppError({key: "global", code: "accountNotExits", status: 404});

            user.password = await argon2.hash(password);
            const result = await this.userRepository.update({userEntity: user});
            return {success: !!result};
        } catch (err) {
            console.log('changePassword err: ', err);
            if (err instanceof AppError) throw err;
            throw new AppError({});
        }
    }
}