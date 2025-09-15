import rateLimit from "express-rate-limit";
import {loadLocale} from "../../shared/utils/locales-helper.js";

export function rateLimitNoView(maxRequests, windowMs) {
    return rateLimit({
        windowMs,
        max: maxRequests,
        standardHeaders: true,
        legacyHeaders: false,
        message: (req, res) => {
            const lang = req.lang;
            const commonJson = loadLocale(lang, 'presentation', "common");
            return {
                global: commonJson.errors.tooManyRequest
            };
        },
    });
}

export function rateLimitWithView({ max, windowMs, getContext, buildViewData }) {
    return rateLimit({
        windowMs,
        max,
        standardHeaders: true,
        legacyHeaders: false,

        handler: async (req, res) => {
            try {
                const context = await getContext(req);
                const viewData = await buildViewData(context);

                return res.status(429).render(context.template, viewData);
            } catch (err) {
                console.error("Rate limit context build failed:", err);
                return res.status(500).render("pages/error", {
                    message: "Server error while handling rate limit",
                });
            }
        },
    });
}


