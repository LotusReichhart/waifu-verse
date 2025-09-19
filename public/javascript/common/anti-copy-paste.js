export function antiCopyPaste(input) {
    if (!input) return;
    ["copy", "cut", "paste", "drop"].forEach(evt => {
        input.addEventListener(evt, e => {
            e.preventDefault();
        });
    });

    input.addEventListener("contextmenu", e => {
        e.preventDefault();
    });
}