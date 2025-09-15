import {isEmail, isEmpty} from "../../../../../shared/utils/text-validator.js";
import {AppError} from "../../../../../shared/utils/app-error.js";
import {UserEntity} from "../../../../../core/domain/entities/user-entity.js";

export class VerifyAccountRegistration {
    constructor(userRepository, otpService) {
        this.userRepository = userRepository;
        this.otpService = otpService;
    }

    async execute({email, otp}) {
        if (isEmpty(email)) {
            throw new AppError({});
        } else if (!isEmail(email)) {
            throw new AppError({});
        }

        if (isEmpty(otp)) {
            throw new AppError({key: "otp", code: "otpEmpty", status: 400});
        }

        try {
            const {success, data} = await this.otpService.verifyOTP({otp: otp, email: email});

            if (!success) throw new AppError({key: "otp", code: "incorrectOtp", status: 400});
            if (!data) throw new AppError({key: "global", code: "serverError", status: 500});

            const {email: regEmail, username: regUsername, password: regPassword} = data;

            const userEntity = new UserEntity({
                email: regEmail,
                username: regUsername,
                password: regPassword,
                name: regUsername.toUpperCase()
            });

            const newUser = await this.userRepository.create({userEntity: userEntity});

            if (!newUser) throw new AppError({key: "otp", code: "serverError", status: 500});

            return {user: newUser};
        } catch (err) {
            console.log("verifyAccountRegistration err: ", err);
            if (err instanceof AppError) throw err;
            throw new AppError({});
        }
    }
}