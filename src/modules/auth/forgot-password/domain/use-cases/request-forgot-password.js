import {isEmail, isEmpty} from "../../../../../shared/utils/text-validator.js";
import {AppError} from "../../../../../shared/utils/app-error.js";
import {generateOTP} from "../../../../../shared/utils/otp-helper.js";
import {buildOtpTemplate} from "../../../../../shared/infra/transport/otp-template.js";

export class RequestForgotPasswordUseCase {
    constructor(userRepository, otpService, mailerService) {
        this.userRepository = userRepository;
        this.otpService = otpService;
        this.mailerService = mailerService;
    }

    async execute({email, i18n}) {
        if (isEmpty(email)) {
            throw new AppError({key: "email", code: "emailEmpty", status: 400});
        } else if (!isEmail(email)) {
            throw new AppError({key: "email", code: "emailInvalid", status: 400});
        }

        try {
            const user = await this.userRepository.getByEmail({email});
            if (!user) throw new AppError({key: "email", code: "emailNotRegistered", status: 404});

            const {allowed} = await this.otpService.checkLimit(email);
            if (!allowed) throw new AppError({key: "email", code: "otpTooManyRequest", status: 429});

            const otp = generateOTP();
            const {subject, html} = buildOtpTemplate({otp, i18n});

            const isSendMail = await this.mailerService.sendMail({to: email, subject, html});
            if (!isSendMail) throw new AppError({code: "serverError"});

            await this.otpService.saveOTP({email: email, otp: otp});

            return {email: email};
        } catch (err) {
            console.log("requestForgotPassword err: ", err);
            if (err instanceof AppError) throw err;
            throw new AppError({});
        }
    }
}