document.addEventListener('DOMContentLoaded', () => {
    (function () {
        function getCookie(name) {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop().split(';').shift();
        }

        let lang = getCookie("lang");
        if (!lang) {
            lang = navigator.language.split('-')[0];
            document.cookie = `lang=${lang}; path=/; max-age=31536000`;
        }

        document.documentElement.setAttribute("lang", lang);

        let theme = getCookie("theme");
        if (!theme) {
            theme = localStorage.getItem("theme");
            if (!theme || theme === "system") {
                const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
                theme = prefersDark ? "dark" : "light";
            }
            document.cookie = `theme=${theme}; path=/; max-age=31536000`;
        }
        localStorage.setItem("theme", theme);

        if (theme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }

        if (theme === "system") {
            window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
                document.documentElement.classList.toggle("dark", e.matches);
            });
        }

        const yearEl = document.getElementById("footer-year");
        if (yearEl) {
            yearEl.textContent = new Date().getFullYear();
        }
    })();
})