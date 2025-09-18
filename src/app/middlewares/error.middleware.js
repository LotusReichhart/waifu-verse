import {verifyAccessToken} from "../../shared/utils/token-helper.js";
import {loadLocale} from "../../shared/utils/locales-helper.js";
import {serviceLocator} from "../service-locator.js";

const getUserById = serviceLocator.user.getUseById;

export function notFoundHandler(req, res, next) {
    const err = new Error("Not Found");
    err.status = 404;
    next(err);
}

export async function errorHandler(err, req, res, next) {
    const token = req.cookies.waifuverse_at;
    const refreshToken = req.cookies.waifuverse_rt;

    if (!token) {
        if (refreshToken) {
            return res.redirect(`/auth/refresh?redirect=${encodeURIComponent(req.originalUrl)}`);
        } else {
            return next();
        }
    }

    const ls = req.cookies.ls;

    let id = null;
    if (token) id = verifyAccessToken(token).id

    const lang = req.lang || "en";
    const status = err.status || 500;

    const commonJson = loadLocale(lang, 'presentation', "common");

    const user = await getUserById.execute({userId: id});
    const userInfo = user?.toPublicInfo();

    let message;
    if (status === 404) {
        message = commonJson.errors?.notFound || "Page not found";
    } else if (status === 500) {
        message = commonJson.errors?.serverError || "Server error";
    } else {
        message = commonJson.errors?.somethingIsWrong || "Something went wrong";
    }

    console.log("Error Middleware: ", err);

    res.status(status).render("presentation/error/index", {
        lang: lang,
        ls: ls,
        userInfo: userInfo,
        status: status,
        message: message,
        commonJson: commonJson,
    });
}