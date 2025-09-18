import {isEmail, isEmpty} from "../../../../../shared/utils/text-validator.js";
import {AppError} from "../../../../../shared/utils/app-error.js";
import {loggerHelper} from "../../../../../shared/utils/logger-helper.js";

export class VerifyForgotPasswordUseCase {
    constructor(otpService) {
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
            const {success} = await this.otpService.verifyOTP({otp: otp, email: email});
            if (!success) throw new AppError({key: "otp", code: "incorrectOtp", status: 400});

            return {success: true};
        } catch (err) {
            loggerHelper.error("verifyForgotPassword err", {error: err});
            if (err instanceof AppError) throw err;
            throw new AppError({});
        }
    }
}
