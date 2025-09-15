import tinymce from "./tinymce/tinymce.js";

export function initTinyMCE(sectionKey, fields) {
    const isDarkMode = document.documentElement.classList.contains('dark');

    fields.forEach(field => {
        const selector = `#editor-${sectionKey}-${field}`;
        if (!document.querySelector(selector)) return;

        tinymce.init({
            selector,
            height: 400,
            menubar: false,
            branding: false,
            license_key: 'gpl',
            image_caption: true,
            image_title: true,
            plugins: 'image link code lists media table',
            toolbar_mode: 'sliding',
            toolbar: 'undo redo | styles | bold italic underline | forecolor backcolor | table | alignleft ' +
                'aligncenter alignright | bullist numlist outdent indent | link image | code',
            skin: isDarkMode ? 'oxide-dark' : 'oxide',
            // content_css: isDarkMode ? '/stylesheets/tinymce-dark.css' : '/stylesheets/tinymce-light.css',
            automatic_uploads: false,
            file_picker_types: 'image',
            color_map: [
                "000000", "Black",
                "FFFFFF", "White",
                "FF0000", "Red",
                "00FF00", "Lime",
                "0000FF", "Blue",
                "FFFF00", "Yellow",
                "00FFFF", "Cyan",
                "FF00FF", "Magenta",
                "800000", "Maroon",
                "808000", "Olive",
                "008000", "Green",
                "800080", "Purple",
                "008080", "Teal",
                "000080", "Navy",
                "C0C0C0", "Silver",
                "808080", "Gray",
                "1F497D", "Dark Blue",
                "4F81BD", "Blue",
                "C0504D", "Dark Red",
                "9BBB59", "Olive Green",
                "8064A2", "Purple",
                "4BACC6", "Teal Blue",
                "F79646", "Orange"
            ],
            color_cols: 6,
            file_picker_callback: function (cb, value, meta) {
                if (meta.filetype === 'image') {
                    const input = document.createElement('input');
                    input.setAttribute('type', 'file');
                    input.setAttribute('accept', 'image/*');

                    input.onchange = function () {
                        const file = this.files[0];
                        const reader = new FileReader();
                        reader.onload = function () {
                            cb(reader.result, { title: file.name });
                        };
                        reader.readAsDataURL(file);
                    };

                    input.click();
                }
            }
        });
    });
}

document.addEventListener('themechange', () => {
    tinymce.remove();
    window.tinymceInitData?.forEach(({ sectionKey, fields }) => {
        initTinyMCE(sectionKey, fields);
    });
});
