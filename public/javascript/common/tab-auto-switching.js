document.addEventListener('DOMContentLoaded', function () {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    function activateTab(targetTab) {
        tabButtons.forEach(btn => {
            const isActive = btn.getAttribute('data-tab') === targetTab;
            btn.classList.toggle('border-b-text', isActive);
            btn.classList.toggle('font-bold', isActive);
        });

        tabContents.forEach(content => {
            content.classList.toggle('hidden', content.getAttribute('data-tab') !== targetTab);
        });
    }

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabKey = btn.getAttribute('data-tab');
            activateTab(tabKey);

            const url = new URL(window.location);
            url.searchParams.set('tab', tabKey);
            history.pushState({}, '', url);

            btn.scrollIntoView({
                behavior: 'smooth',
                inline: 'center',
                block: 'nearest'
            });
        });
    });

    const urlParams = new URLSearchParams(window.location.search);
    const queryTab = urlParams.get('tab');

    const initialTab = queryTab || window.initialSectionTab || tabButtons[0]?.getAttribute('data-tab');
    if (initialTab) {
        activateTab(initialTab);

        const activeBtn = document.querySelector(`.tab-button[data-tab="${initialTab}"]`);
        if (activeBtn) {
            activeBtn.scrollIntoView({
                behavior: 'smooth',
                inline: 'center',
                block: 'nearest'
            });
        }

        if (window.errorSectionTab && window.errorSectionTab === initialTab) {
            const formEl = document.getElementById(`form-${initialTab}`);
            if (formEl) {
                formEl.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }
});
