import {appConfig} from "../../../../config/app-config.js";

export function registerUIData({
                                     lang,
                                     registerJson,
                                     commonJson,
                                     formData = {},
                                     step = "submit",
                                     duration,
                                     errorFields = {},
                                 }) {
    return {
        lang: lang,
        registerJson: registerJson,
        commonJson: commonJson,
        formData: formData,
        duration: duration,
        step: step,
        errorFields: errorFields,
        canonicalUrl: `${appConfig.server.domain}/${lang}/auth/register`,
    };
}