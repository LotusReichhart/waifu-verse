import {loadLocale} from "../../../../shared/utils/locales-helper.js";
import {registerUIData} from "./ui-data.js";
import {AppError} from "../../../../shared/utils/app-error.js";
import {serviceLocator} from "../../../../app/service-locator.js";
import {setAuthCookies, setUserPreferenceCookies} from "../../../../shared/utils/cookies-helper.js";
import {loggerHelper} from "../../../../shared/utils/logger-helper.js";

export function renderRegisterPage(req, res) {
    const lang = req.lang;
    const registerJson = loadLocale(lang, 'core', 'auth', "register");
    const commonJson = loadLocale(lang, 'presentation', "common");

    const uiData = registerUIData({
        lang: lang,
        registerJson: registerJson,
        commonJson: commonJson,
    });
    return res.status(200).render("modules/auth/register/index", uiData);
}

const requestAccountRegistration = serviceLocator.auth.requestAccountRegistration;

export async function postRequestRegister(req, res) {
    const {email, username, password} = req.body;
    const lang = req.lang;
    const registerJson = loadLocale(lang, 'core', 'auth', "register");
    const commonJson = loadLocale(lang, 'presentation', "common");
    const mailerJson = loadLocale(lang, 'presentation', "mailer");

    try {
        const {email: emailResult} = await requestAccountRegistration.execute({
            email: email,
            username: username,
            password: password,
            i18n: mailerJson.otp.register,
        });

        const uiData = registerUIData({
            lang: lang,
            registerJson: registerJson,
            commonJson: commonJson,
            formData: {email: emailResult},
            step: "verify",
        });
        return res.status(200).render("modules/auth/register/index", uiData);
    } catch (err) {
        loggerHelper.error('postRequestRegister error', {error: err});

        let errorFields = {};

        const getMessage = (e) => {
            return (
                (e.status !== 500
                    ? registerJson.main.errors[e.code]
                    : commonJson.errors[e.code]) ?? commonJson.errors.serverError
            );
        };

        if (Array.isArray(err)) {
            err.forEach((e) => {
                errorFields[e.key] = getMessage(e);
            });
        } else if (err instanceof AppError) {
            errorFields[err.key] = getMessage(err);
        } else {
            errorFields["global"] = commonJson.errors.serverError;
        }

        const uiData = registerUIData({
            lang: lang,
            registerJson: registerJson,
            commonJson: commonJson,
            formData: {email, username},
            errorFields: errorFields,
        });

        const status = Array.isArray(err) ? 400 : (err.status || 500);
        return res.status(status).render("modules/auth/register/index", uiData);
    }
}

const verifyAccountRegistration = serviceLocator.auth.verifyAccountRegistration;
const issueTokens = serviceLocator.auth.issueTokens;

export async function postVerifyRegister(req, res) {
    const {otp, email, duration} = req.body;
    const lang = req.lang;
    const registerJson = loadLocale(lang, 'core', 'auth', "register");
    const commonJson = loadLocale(lang, 'presentation', "common");

    try {
        const {user} = await verifyAccountRegistration.execute({otp: otp, email: email});

        const {accessToken, refreshToken} = await issueTokens.execute(user);

        const userLang = user?.settings?.lang || "en";
        const theme = user?.settings?.theme || "light";

        setAuthCookies({
            res: res,
            accessToken: accessToken,
            refreshToken: refreshToken,
        });

        setUserPreferenceCookies({
            res: res,
            lang: userLang,
            theme: theme,
        });

        return res.redirect("/");
    } catch (err) {
        loggerHelper.error('postVerifyRegister error', {error: err});

        const errorFields = {
            [err.key]: (err.status !== 500
                ? registerJson.main.errors[err.code]
                : commonJson.errors[err.code]) ?? commonJson.errors.serverError
        };

        const uiData = registerUIData({
            lang: lang,
            registerJson: registerJson,
            commonJson: commonJson,
            formData: {email: email},
            step: "verify",
            duration: duration,
            errorFields: errorFields,
        });

        return res.status(err.status).render("modules/auth/register/index", uiData);
    }
}
