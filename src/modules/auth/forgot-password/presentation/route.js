import express from 'express';
import {postRequestForgotPassword, postVerifyForgotPassword, renderForgotPasswordPage} from "./controller.js";
import {rateLimitWithView} from "../../../../app/middlewares/rate-limiter-middleware.js";
import {loadLocale} from "../../../../shared/utils/locales-helper.js";
import {forgotPasswordUIData} from "./ui-data.js";

const router = express.Router();

router.get('/', renderForgotPasswordPage);
router.post(
    '/',
    rateLimitWithView({
        max: 5,
        windowMs: 60 * 1000,
        getContext: async (req) => {
            const lang = req.lang;
            const forgotPasswordJson = loadLocale(lang, 'core', 'auth', "forgot-password");
            const commonJson = loadLocale(lang, 'presentation', "common");

            return {
                lang: lang,
                forgotPasswordJson: forgotPasswordJson,
                commonJson: commonJson,
                formData: {email: req.body.email || ''},
                template: "modules/auth/forgot-password/index",
            };
        },
        buildViewData: (context) =>
            forgotPasswordUIData({
                lang: context.lang,
                forgotPasswordJson: context.forgotPasswordJson,
                commonJson: context.commonJson,
                formData: context.formData,
                errorFields: {global: context.commonJson.errors.tooManyRequest},
            })
    }),
    postRequestForgotPassword);
router.post(
    '/verify',
    rateLimitWithView({
        max: 5,
        windowMs: 60 * 1000,
        getContext: async (req) => {
            const lang = req.lang;
            const forgotPasswordJson = loadLocale(lang, 'core', 'auth', "forgot-password");
            const commonJson = loadLocale(lang, 'presentation', "common");

            return {
                lang: lang,
                forgotPasswordJson: forgotPasswordJson,
                commonJson: commonJson,
                formData: {email: req.body.email || ''},
                duration: req.body.duration || 0,
                step: "verify",
                template: "modules/auth/forgot-password/index",
            };
        },
        buildViewData: (context) =>
            forgotPasswordUIData({
                lang: context.lang,
                forgotPasswordJson: context.forgotPasswordJson,
                commonJson: context.commonJson,
                formData: context.formData,
                step: context.step,
                duration: context.duration,
                errorFields: {global: context.commonJson.errors.tooManyRequest},
            }),
    }),
    postVerifyForgotPassword);

export default router;