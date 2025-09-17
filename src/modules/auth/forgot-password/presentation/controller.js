import {loadLocale} from "../../../../shared/utils/locales-helper.js";
import {forgotPasswordUIData} from "./ui-data.js";
import {serviceLocator} from "../../../../app/service-locator.js";

export function renderForgotPasswordPage(req, res) {
    const lang = req.lang;
    const forgotPasswordJson = loadLocale(lang, 'core', 'auth', "forgot-password");
    const commonJson = loadLocale(lang, 'presentation', "common");

    const uiData = forgotPasswordUIData({
        lang: lang,
        forgotPasswordJson: forgotPasswordJson,
        commonJson: commonJson
    });
    return res.status(200).render("modules/auth/forgot-password/index", uiData);
}

const requestForgotPassword = serviceLocator.auth.requestForgotPassword;

export async function postRequestForgotPassword(req, res) {
    const {email} = req.body;
    const lang = req.lang;
    const forgotPasswordJson = loadLocale(lang, 'core', 'auth', "forgot-password");
    const commonJson = loadLocale(lang, 'presentation', "common");
    const mailerJson = loadLocale(lang, 'presentation', "mailer");

    try {
        const {email: emailResult} = await requestForgotPassword.execute({
            email: email,
            i18n: mailerJson.otp['forgot-password']
        });

        const uiData = forgotPasswordUIData({
            lang: lang,
            forgotPasswordJson: forgotPasswordJson,
            commonJson: commonJson,
            formData: {email: emailResult},
            step: "verify",
        });
        return res.status(200).render("modules/auth/forgot-password/index", uiData);
    } catch (err) {
        console.log('postRequestForgotPassword error:', err);

        const errorFields = {
            [err.key]: (err.status !== 500
                ? forgotPasswordJson.main.errors[err.code]
                : commonJson.errors[err.code]) ?? commonJson.errors.serverError
        };

        const uiData = forgotPasswordUIData({
            lang: lang,
            forgotPasswordJson: forgotPasswordJson,
            commonJson: commonJson,
            formData: {email: email},
            errorFields: errorFields,
        });

        return res.status(err.status).render("modules/auth/forgot-password/index", uiData);
    }
}

const verifyForgotPassword = serviceLocator.auth.verifyForgotPassword;
const saveResetToken = serviceLocator.auth.saveResetToken;

export async function postVerifyForgotPassword(req, res) {
    const {otp, email, duration} = req.body;
    const lang = req.lang;
    const forgotPasswordJson = loadLocale(lang, 'core', 'auth', "forgot-password");
    const commonJson = loadLocale(lang, 'presentation', "common");

    try {
        const {success} = await verifyForgotPassword.execute({
            email: email,
            otp: otp,
        });

        if (success) {
            const {resetToken} = await saveResetToken.execute({email});
            if (resetToken) {
                res.cookie("waifuverse_rpt", resetToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "Strict",
                    maxAge: 15 * 60 * 1000
                });
            }
        }

        const uiData = forgotPasswordUIData({
            lang: lang,
            forgotPasswordJson: forgotPasswordJson,
            commonJson: commonJson,
            step: "new-password",
        });
        return res.status(200).render("modules/auth/forgot-password/index", uiData);
    } catch (err) {
        console.log('postVerifyForgotPassword error:', err);

        const errorFields = {
            [err.key]: (err.status !== 500
                ? forgotPasswordJson.main.errors[err.code]
                : commonJson.errors[err.code]) ?? commonJson.errors.serverError
        };

        const uiData = forgotPasswordUIData({
            lang: lang,
            forgotPasswordJson: forgotPasswordJson,
            commonJson: commonJson,
            formData: {email: email},
            step: "verify",
            duration: duration,
            errorFields: errorFields,
        });

        return res.status(err.status).render("modules/auth/forgot-password/index", uiData);
    }
}