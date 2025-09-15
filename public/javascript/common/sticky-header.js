document.addEventListener('DOMContentLoaded', () => {
    setupStickyHeader();
});

function setupStickyHeader() {
    const appHeader = document.querySelector('.app-header');
    const scrollWatcher = document.createElement('div');
    scrollWatcher.setAttribute('data-scroll-watcher', '');
    appHeader.before(scrollWatcher);

    new IntersectionObserver(([entry]) => {
        appHeader.classList.toggle('sticking', !entry.isIntersecting);
    }, {
        rootMargin: '50px 0px 0px 0px',
    }).observe(scrollWatcher);
}