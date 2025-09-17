import {appConfig} from "../../../../config/app-config.js";

export function forgotPasswordUIData({
                                         lang,
                                         forgotPasswordJson,
                                         commonJson,
                                         formData = {},
                                         step = "submit",
                                         duration,
                                         errorFields = {},
                                     }) {
    return {
        lang: lang,
        forgotPasswordJson: forgotPasswordJson,
        commonJson: commonJson,
        formData: formData,
        duration: duration,
        step: step,
        errorFields: errorFields,
        canonicalUrl: `${appConfig.server.domain}/${lang}/auth/forgot-password`,
    };
}