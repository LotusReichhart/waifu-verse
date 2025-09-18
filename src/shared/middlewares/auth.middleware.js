import {verifyAccessToken} from "../utils/token-helper.js";
import {serviceLocator} from "../../app/service-locator.js";
import {USER_STATUS} from "../utils/schema-status.js";

const getUserById = serviceLocator.user.getUseById;

export async function authMiddleware(req, res, next) {
    const token = req.cookies.waifuverse_at;
    if (!token) return res.redirect(`/auth/refresh?redirect=${encodeURIComponent(req.originalUrl)}`);

    try {
        const decoded = verifyAccessToken(token)
        const user = await getUserById.execute({userId: decoded.id});
        if (!user || user.status !== USER_STATUS.ACTIVE) return res.redirect('/auth/login');

        req.user = user;
        next();
    } catch {
        return res.redirect(`/auth/refresh?redirect=${encodeURIComponent(req.originalUrl)}`);
    }
}

export async function optionalAuthMiddleware(req, res, next) {
    const token = req.cookies.waifuverse_at;
    const refreshToken = req.cookies.waifuverse_rt;

    if (!token) {
        if (refreshToken) {
            return res.redirect(`/auth/refresh?redirect=${encodeURIComponent(req.originalUrl)}`);
        } else {
            return next();
        }
    }

    try {
        const decoded = verifyAccessToken(token)
        const user = await getUserById.execute({userId: decoded.id});

        if (!user || user.status !== USER_STATUS.ACTIVE) {
            req.user = null;
        } else {
            req.user = user;
        }

        next();
    } catch {
        req.user = null;
        next();
    }
}