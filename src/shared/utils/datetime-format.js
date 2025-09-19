export function formatUserTime(date) {
    if (!date) return "";
    const d = date instanceof Date ? date : new Date(date);

    new Intl.DateTimeFormat(navigator.language, {
        dateStyle: "medium",
        timeStyle: "short"
    }).format(d);
}
