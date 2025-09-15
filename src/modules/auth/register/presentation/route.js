import express from 'express';
import {
    postRequestRegister, postVerifyRegister,
    renderRegisterPage
} from "./controller.js";
import {rateLimitWithView} from "../../../../app/middlewares/rate-limiter-middleware.js";
import {loadLocale} from "../../../../shared/utils/locales-helper.js";
import {registerUIData} from "./ui-data.js";

const router = express.Router();

router.get('/', renderRegisterPage);
router.post(
    '/',
    rateLimitWithView({
        max: 5,
        windowMs: 60 * 1000,
        getContext: async (req) => {
            const lang = req.lang;
            const registerJson = loadLocale(lang, 'core', 'auth', "register");
            const commonJson = loadLocale(lang, 'presentation', "common");

            return {
                lang: lang,
                registerJson: registerJson,
                commonJson: commonJson,
                formData: {email: req.body.email || '', username: req.body.username || ''},
                template: "modules/auth/register/index",
            };
        },
        buildViewData: (context) =>
            registerUIData({
                lang: context.lang,
                registerJson: context.registerJson,
                commonJson: context.commonJson,
                formData: context.formData,
                errorFields: {global: context.commonJson.errors.tooManyRequest},
            })
    }),
    postRequestRegister);

router.post(
    '/verify',
    rateLimitWithView({
        max: 5,
        windowMs: 60 * 1000,
        getContext: async (req) => {
            const lang = req.lang;
            const registerJson = loadLocale(lang, 'core', 'auth', "register");
            const commonJson = loadLocale(lang, 'presentation', "common");

            return {
                lang: lang,
                registerJson: registerJson,
                commonJson: commonJson,
                formData: {email: req.body.email || ''},
                duration: req.body.duration || 0,
                step: "verify",
                template: "modules/auth/register/index",
            };
        },
        buildViewData: (context) =>
            registerUIData({
                lang: context.lang,
                registerJson: context.registerJson,
                commonJson: context.commonJson,
                formData: context.formData,
                step: context.step,
                duration: context.duration,
                errorFields: {global: context.commonJson.errors.tooManyRequest},
            }),
    }),
    postVerifyRegister);

export default router;