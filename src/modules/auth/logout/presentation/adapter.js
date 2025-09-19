import {serviceLocator} from "../../../../app/service-locator.js";

const deleteRefreshToken = serviceLocator.auth.deleteRefreshToken;

export async function logout(req, res, next) {
    const refreshToken = req.cookies.waifuverse_rt;
    if (refreshToken) {
        await deleteRefreshToken.execute(refreshToken);
    }
    res.clearCookie("waifuverse_at");
    res.clearCookie("waifuverse_rt");
    res.redirect("/auth/login");
}