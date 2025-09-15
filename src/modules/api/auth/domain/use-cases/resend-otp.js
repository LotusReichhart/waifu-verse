import {isEmail, isEmpty} from "../../../../../shared/utils/text-validator.js";
import {AppError} from "../../../../../shared/utils/app-error.js";
import {buildOtpTemplate} from "../../../../../shared/infra/transport/otp-template.js";
import {generateOTP} from "../../../../../shared/utils/otp-helper.js";

export class ResendOTPUseCase {
    constructor(otpService, mailerService) {
        this.otpService = otpService;
        this.mailerService = mailerService;
    }

    async execute({email, i18n}) {
        if (isEmpty(email)) {
            throw new AppError({});
        } else if (!isEmail(email)) {
            throw new AppError({});
        }

        try {
            const {allowed} = await this.otpService.checkLimit(email);

            if (!allowed) throw new AppError({key: "message", code: "otpTooManyRequest", status: 400});

            const otp = generateOTP();
            const {subject, html} = buildOtpTemplate({otp, i18n});

            const isSendMail = await this.mailerService.sendMail({to: email, subject, html});

            if (!isSendMail) throw new AppError({key: "message", code: "serverError"});

            const {success, data} = await this.otpService.updateOTP({email: email, otp: otp});
            if (success && !data) {
                await this.otpService.saveOTP({email: email, otp: otp});
            }
        } catch (err) {
            console.log("ResendOtp err: ", err);
            if (err instanceof AppError) throw err;
            throw new AppError({});
        }
    }
}