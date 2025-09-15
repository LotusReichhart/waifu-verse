import { isCode, isEmail, isEmpty, isNumeric, isTooShort } from "../../../../../shared/utils/text-validator.js";
import { AppError } from "../../../../../shared/utils/app-error.js";
import { generateOTP } from "../../../../../shared/utils/otp-helper.js";
import { buildOtpTemplate } from "../../../../../shared/infra/transport/otp-template.js";

export class RequestAccountRegistrationUseCase {
    constructor(userRepository, otpService, mailerService) {
        this.userRepository = userRepository;
        this.otpService = otpService;
        this.mailerService = mailerService;
    }

    async execute({ email, username, password, i18n }) {
        const errors = [];

        if (isEmpty(email)) {
            errors.push(new AppError({ key: "email", code: "emailEmpty", status: 400 }));
        } else if (!isEmail(email)) {
            errors.push(new AppError({ key: "email", code: "emailInvalid", status: 400 }));
        }

        if (isEmpty(username)) {
            errors.push(new AppError({ key: "username", code: "usernameEmpty", status: 400 }));
        } else {
            if (isCode(username)) {
                errors.push(new AppError({ key: "username", code: "usernameIsCode", status: 400 }));
            } else if (isNumeric(username)) {
                errors.push(new AppError({ key: "username", code: "usernameIsNumeric", status: 400 }));
            } else if (isTooShort(username, 8)) {
                errors.push(new AppError({ key: "username", code: "usernameTooShort", status: 400 }));
            }
        }

        if (isEmpty(password)) {
            errors.push(new AppError({ key: "password", code: "passwordEmpty", status: 400 }));
        } else if (isTooShort(password, 8)) {
            errors.push(new AppError({ key: "password", code: "passwordTooShort", status: 400 }));
        }

        if (errors.length > 0) {
            throw errors;
        }

        try {
            const [userByEmail, userByUsername] = await Promise.all([
                this.userRepository.getByEmail({ email }),
                this.userRepository.getByUsername({ username })
            ]);

            if (userByEmail) throw new AppError({ key: "email", code: "emailAlready", status: 409 });
            if (userByUsername) throw new AppError({ key: "username", code: "usernameExists", status: 409 });

            const { allowed } = await this.otpService.checkLimit(email);
            if (!allowed) throw new AppError({ key: "email", code: "otpTooManyRequest", status: 429 });

            const otp = generateOTP();
            const { subject, html } = buildOtpTemplate({ otp, i18n });

            const isSendMail = await this.mailerService.sendMail({ to: email, subject, html });
            if (!isSendMail) throw new AppError({ code: "serverError" });

            await this.otpService.saveOTP({ email, otp, username, password });

            return { email: email };
        } catch (err) {
            console.log("requestAccountRegistration err: ", err);
            if (err instanceof AppError) throw err;
            throw new AppError({});
        }
    }
}
