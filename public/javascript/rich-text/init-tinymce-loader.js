import {initTinyMCE} from "./init-tinymce.js";

document.addEventListener('DOMContentLoaded', () => {
    if (Array.isArray(window.tinymceInitData)) {
        window.tinymceInitData.forEach(({ sectionKey, fields }) => {
            initTinyMCE(sectionKey, fields);
        });
    }
});
