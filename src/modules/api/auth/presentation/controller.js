import {loadLocale} from "../../../../shared/utils/locales-helper.js";
import {serviceLocator} from "../../../../app/service-locator.js";

const resendOTP = serviceLocator.api.resendOtp;

export async function postResendOTP(req, res) {
    const {email, step} = req.body;
    const lang = req.lang;

    const commonJson = loadLocale(lang, 'presentation', "common");
    const mailerJson = loadLocale(lang, 'presentation', "mailer");

    const json = loadLocale(lang, 'core', 'auth', step);
    const i18n = mailerJson.otp[step];

    try {
        await resendOTP.execute({email: email, i18n: i18n});

        return res.status(200).json({message: ""});
    } catch (err) {
        console.log('postResendOTP error:', err);

        const errorFields = {
            [err.key]: (err.status !== 500
                ? json.main.errors[err.code]
                : commonJson.errors[err.code]) ?? commonJson.errors.serverError
        };

        return res.status(err.status).json(errorFields);
    }
}