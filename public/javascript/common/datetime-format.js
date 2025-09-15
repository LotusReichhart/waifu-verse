document.addEventListener('DOMContentLoaded', () => {
    setUpDatetimeFormat();
});

function setUpDatetimeFormat() {
    document.querySelectorAll(".datetime").forEach(el => {
        const date = new Date(el.dataset.time);
        el.textContent = new Intl.DateTimeFormat(navigator.language, {
            dateStyle: "medium",
            timeStyle: "short"
        }).format(date);
    });
}