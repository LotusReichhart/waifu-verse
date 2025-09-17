import {serviceLocator} from "../../../../app/service-locator.js";
import {setAuthCookies, setUserPreferenceCookies} from "../../../../shared/utils/cookies-helper.js";

const loginWithGoogle = serviceLocator.auth.loginWithGoogle;
const issueTokens = serviceLocator.auth.issueTokens;

export async function googleCallBack(req, res, next) {
    const id = req.user;
    try {
        const {user} = await loginWithGoogle.execute(id);
        const {accessToken, refreshToken} = await issueTokens.execute(user);

        const userLang = user?.settings?.lang || "en";
        const theme = user?.settings?.theme || "light";

        setAuthCookies({
            res: res,
            accessToken: accessToken,
            refreshToken: refreshToken,
        });

        setUserPreferenceCookies({
            res: res,
            lang: userLang,
            theme: theme,
        });

        return res.redirect("/");
    } catch (err) {
        console.log('googleCallback error:', err);
        next(err);
    }
}