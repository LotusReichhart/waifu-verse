export function i18nMiddleware(req, res, next) {
    const supported = ["en", "vi"];
    const urlLang = req.params.lang;

    let lang = supported.includes(urlLang) ? urlLang : (req.cookies.lang || "en");

    req.lang = lang;
    res.locals.lang = lang;
    next();
}
