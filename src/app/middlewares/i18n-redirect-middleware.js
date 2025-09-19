export function i18nRedirectMiddleware(req, res, next) {
    const supported = ["en", "vi"];

    if (req.path.startsWith("/api")) {
        return next();
    }

    const urlLang = req.path.split("/")[1];

    if (supported.includes(urlLang)) {
        return next();
    }

    let lang = req.cookies.lang;
    if (!lang || !supported.includes(lang)) {
        lang = (req.acceptsLanguages(supported) || "en");
    }

    return res.redirect(`/${lang}${req.originalUrl}`);
}
