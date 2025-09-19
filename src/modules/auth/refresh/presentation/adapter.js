import {serviceLocator} from "../../../../app/service-locator.js";
import {setAuthCookies} from "../../../../shared/utils/cookies-helper.js";

const verifyRefreshToken = serviceLocator.auth.verifyRefreshToken;
const refreshAuth = serviceLocator.auth.refreshAuth;

export async function refresh(req, res, next) {
    const refreshToken = req.cookies.waifuverse_rt;
    if (!refreshToken) return res.redirect("/auth/login");

    try {
        const redirectUrl = req.query.redirect || "/";

        const {userId} = await verifyRefreshToken.execute(refreshToken);

        if (!userId) return res.redirect("/auth/login");

        const {accessToken} = await refreshAuth.execute({userId: userId});

        setAuthCookies({
            res: res,
            accessToken: accessToken
        });

        return res.redirect(redirectUrl);
    } catch (err) {
        console.error("refresh error:", err);
        next(err);
    }
}