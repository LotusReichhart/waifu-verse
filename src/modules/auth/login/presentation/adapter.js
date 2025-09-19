import {loadLocale} from "../../../../shared/utils/locales-helper.js";
import {loginUIData} from "./ui-data.js";
import {serviceLocator} from "../../../../app/service-locator.js";
import {setAuthCookies, setUserPreferenceCookies} from "../../../../shared/utils/cookies-helper.js";
import {loggerHelper} from "../../../../shared/utils/logger-helper.js";

export function renderLoginPage(req, res) {
    const lang = req.lang;
    const loginJson = loadLocale(lang, 'core', 'auth', "login");
    const commonJson = loadLocale(lang, 'presentation', "common");

    const uiData = loginUIData({
        lang: lang,
        loginJson: loginJson,
        commonJson: commonJson
    });

    loggerHelper.info(`Render login page with lang=${lang}`);

    return res.status(200).render("modules/auth/login/index", uiData);
}

const loginWithUsernameOrEmail = serviceLocator.auth.loginWithUsernameOrEmail;
const issueTokens = serviceLocator.auth.issueTokens;

export async function postLogin(req, res) {
    const {input, password} = req.body;
    const lang = req.lang;
    const loginJson = loadLocale(lang, 'core', 'auth', "login");
    const commonJson = loadLocale(lang, 'presentation', "common");

    try {
        const {user} = await loginWithUsernameOrEmail.execute({
            input: input,
            password: password,
        });

        loggerHelper.info(`User ${user.username || user.email} logged in`);

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
        loggerHelper.error(`postLogin error: ${err.message}`, {stack: err.stack});

        const errorFields = {
            [err.key]: (err.status !== 500
                ? loginJson.main.errors[err.code]
                : commonJson.errors[err.code]) ?? commonJson.errors.serverError
        };

        const uiData = loginUIData({
            lang: lang,
            loginJson: loginJson,
            commonJson: commonJson,
            errorFields: errorFields,
            formData: {input}
        });

        return res.status(err.status).render("modules/auth/login/index", uiData);
    }
}
