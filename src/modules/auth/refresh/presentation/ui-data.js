import {appConfig} from "../../../../config/app-config.js";

export function loginUIData({
                                lang,
                                loginJson,
                                commonJson,
                                formData = {},
                                errorFields = {},
                            }) {
    return {
        lang: lang,
        loginJson: loginJson,
        commonJson: commonJson,
        formData: formData,
        errorFields: errorFields,
        canonicalUrl: `${appConfig.server.domain}/${lang}/auth/login`,
    };
}