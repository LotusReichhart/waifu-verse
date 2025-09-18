import {loadLocale} from "../../../../shared/utils/locales-helper.js";
import {serviceLocator} from "../../../../app/service-locator.js";
import {loggerHelper} from "../../../../shared/utils/logger-helper.js";

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
        loggerHelper.error('postResendOTP error', {error: err});

        const errorFields = {
            [err.key]: (err.status !== 500
                ? json.main.errors[err.code]
                : commonJson.errors[err.code]) ?? commonJson.errors.serverError
        };

        return res.status(err.status).json(errorFields);
    }
}

const changePassword = serviceLocator.api.changePassword;
const verifyResetToken = serviceLocator.auth.verifyResetToken;
const deleteResetToken = serviceLocator.auth.deleteResetToken;

export async function postChangePassword(req, res) {
    const lang = req.lang;
    const {password, confirmPassword, step} = req.body;

    const resetToken = req.cookies.waifuverse_rpt;

    const forgotPasswordJson = loadLocale(lang, 'core', 'auth', "forgot-password");
    const changePasswordJson = loadLocale(lang, 'core', 'user', "change-password");
    const commonJson = loadLocale(lang, 'presentation', "common");

    const json = step === "forgotPassword" ? forgotPasswordJson : changePasswordJson;

    try {
        const {email} = await verifyResetToken.execute(resetToken);
        const {success} = await changePassword.execute({
            email: email,
            password: password,
            confirmPassword: confirmPassword
        });

        await deleteResetToken.execute(resetToken);

        res.clearCookie("waifuverse_rpt", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict"
        });

        if (success) {
            return res.status(200).json({
                message: json.main.message.changePasswordSuccess
            });
        } else {
            return res.status(500).json({
                message: json.main.message.changePasswordFailed
            });
        }
    } catch (err) {
        loggerHelper.error('postChangePassword error', {error: err});

        const errorFields = {
            [err.key]: (err.status !== 500
                ? json.main.errors[err.code]
                : commonJson.errors[err.code]) ?? commonJson.errors.serverError
        };

        return res.status(err.status).json(errorFields);
    }
}
