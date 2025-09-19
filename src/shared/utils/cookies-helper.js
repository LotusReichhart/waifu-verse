export function setAuthCookies({res = null, accessToken = null, refreshToken = null}) {
    if (!res) return;
    if (accessToken) {
        res.cookie("waifuverse_at", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Lax",
            maxAge: 60 * 60 * 1000,
        });
    }

    if (refreshToken) {
        res.cookie("waifuverse_rt", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Lax",
            maxAge: 30 * 24 * 60 * 60 * 1000
        });
    }
}

export function setUserPreferenceCookies({res = null, lang = null, theme = null}) {
    if (!res) return;

    if (lang) {
        res.cookie("lang", lang, {
            httpOnly: false,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Lax",
            maxAge: 365 * 24 * 60 * 60 * 1000
        });
    }

    if (theme) {
        res.cookie("theme", theme, {
            httpOnly: false,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Lax",
            maxAge: 365 * 24 * 60 * 60 * 1000
        });
    }
}