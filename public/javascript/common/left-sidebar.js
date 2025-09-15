document.addEventListener('DOMContentLoaded', () => {
    setupLeftSidebar();
});

window.addEventListener('resize', () => {
    setupLeftSidebar();
});

function setupLeftSidebar() {
    const leftSidebar = document.getElementById('left-sidebar');
    const mainContent = document.getElementById('main-content');
    const leftSidebarToggle = document.getElementById('left-sidebar-toggle');
    const leftSidebarClose = document.getElementById('left-sidebar-close');
    const leftSidebarBackdrop = document.getElementById('left-sidebar-backdrop');
    const headerLogo = document.getElementById('header-logo');

    const isMobileView = isMobile();

    const openSidebar = () => {
        leftSidebar.classList.remove('left-sidebar-hidden', 'hidden');
        leftSidebar.classList.add('left-sidebar-shown');
        headerLogo?.classList.add('hidden');
        headerLogo?.classList.remove('flex');
        mainContent.classList.add('main-shifted');

        if (isMobileView) {
            leftSidebarBackdrop.classList.remove('hidden');
            requestAnimationFrame(() => leftSidebarBackdrop.classList.add('opacity-100'));
        }
    };

    const closeSidebar = () => {
        leftSidebar.classList.remove('left-sidebar-shown');
        leftSidebar.classList.add('left-sidebar-hidden', 'hidden');
        headerLogo?.classList.add('flex');
        headerLogo?.classList.remove('hidden', 'md:hidden');
        mainContent.classList.remove('main-shifted');

        if (isMobileView) {
            leftSidebarBackdrop.classList.remove('opacity-100');
            leftSidebarBackdrop.addEventListener('transitionend', () =>
                leftSidebarBackdrop.classList.add('hidden'), {once: true});
        }
    };

    leftSidebarToggle?.addEventListener('click', openSidebar);
    leftSidebarClose?.addEventListener('click', closeSidebar);
    leftSidebarBackdrop?.addEventListener('click', closeSidebar);
    window.closeSidebar = closeSidebar;
}