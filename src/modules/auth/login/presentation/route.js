import express from 'express';
import {postLogin, renderLoginPage} from "./controller.js";
import {rateLimitWithView} from "../../../../app/middlewares/rate-limiter-middleware.js";
import {loadLocale} from "../../../../shared/utils/locales-helper.js";
import {loginUIData} from "./ui-data.js";


const router = express.Router();

router.get('/', renderLoginPage);
router.post(
    '/',
    rateLimitWithView({
        max: 5,
        windowMs: 60 * 1000,
        getContext: async (req) => {
            const lang = req.lang;
            const loginJson = loadLocale(lang, 'core', 'auth', "login");
            const commonJson = loadLocale(lang, 'presentation', "common");

            return {
                lang: lang,
                loginJson: loginJson,
                commonJson: commonJson,
                formData: {input: req.body.input || ''},
                template: "modules/auth/login/index",
            };
        },
        buildViewData: (context) =>
            loginUIData({
                lang: context.lang,
                loginJson: context.loginJson,
                commonJson: context.commonJson,
                formData: context.formData,
                errorFields: {global: context.commonJson.errors.tooManyRequest},
            })
    }),
    postLogin);

export default router;