import {loadLocale} from "../../shared/utils/locales-helper.js";
import {appConfig} from "../../config/app-config.js";

export async function renderHomePage(req, res) {
    const lang = req.lang;
    const user = req.user;
    const ls = req.cookies.ls;

    const homeJson = loadLocale(lang, 'presentation', "home");
    const commonJson = loadLocale(lang, 'presentation', "common");

    const userInfo = user ? user?.toPublicInfo() : null;

    return res.status(200).render("presentation/home/index", {
        lang: lang,
        ls: ls,
        userInfo: userInfo,
        homeJson: homeJson,
        commonJson: commonJson,
        canonicalUrl: `${appConfig.server.domain}/${lang}`
    });
}

export async function renderPrivacyPolicyPage(req, res) {
    const lang = req.lang;
    const user = req.user;
    const ls = req.cookies.ls;

    const privacyPolicyJson = loadLocale(lang, 'presentation', "privacy-policy");
    const commonJson = loadLocale(lang, 'presentation', "common");

    const userInfo = user ? user?.toPublicInfo() : null;

    return res.status(200).render("presentation/privacy-policy/index", {
        lang: lang,
        ls: ls,
        userInfo: userInfo,
        privacyPolicyJson: privacyPolicyJson,
        commonJson: commonJson,
        canonicalUrl: `${appConfig.server.domain}/${lang}/privacy-policy`
    });
}

export async function renderTermsOfUsePage(req, res) {
    const lang = req.lang;
    const user = req.user;
    const ls = req.cookies.ls;

    const termsOfUseJson = loadLocale(lang, 'presentation', "terms-of-use");
    const commonJson = loadLocale(lang, 'presentation', "common");

    const userInfo = user ? user?.toPublicInfo() : null;

    return res.status(200).render("presentation/terms-of-use/index", {
        lang: lang,
        ls: ls,
        userInfo: userInfo,
        termsOfUseJson: termsOfUseJson,
        commonJson: commonJson,
        canonicalUrl: `${appConfig.server.domain}/${lang}/terms-of-use`,
    });
}