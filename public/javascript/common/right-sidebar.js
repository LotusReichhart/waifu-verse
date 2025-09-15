document.addEventListener('DOMContentLoaded', () => {
    setupRightSidebar();
});

function setupRightSidebar() {
    const rightSidebar = document.getElementById('right-sidebar');
    const rightSidebarToggle = document.getElementById('right-sidebar-toggle');
    const rightSidebarClose = document.getElementById('right-sidebar-close');
    const rightSidebarBackdrop = document.getElementById('right-sidebar-backdrop');

    const openSidebar = () => {
        rightSidebar.classList.remove('right-sidebar-hidden', 'hidden');
        rightSidebar.classList.add('right-sidebar-shown');

        rightSidebarBackdrop.classList.remove('hidden');
        requestAnimationFrame(() => rightSidebarBackdrop.classList.add('opacity-100'));
    };

    const closeSidebar = () => {
        rightSidebar.classList.remove('right-sidebar-shown');
        rightSidebar.classList.add('right-sidebar-hidden', 'hidden');

        rightSidebarBackdrop.classList.remove('opacity-100');
        rightSidebarBackdrop.addEventListener('transitionend', () =>
            rightSidebarBackdrop.classList.add('hidden'), {once: true});
    };

    rightSidebarToggle?.addEventListener('click', openSidebar);
    rightSidebarClose?.addEventListener('click', closeSidebar);
    rightSidebarBackdrop?.addEventListener('click', closeSidebar);
    window.closeSidebar = closeSidebar;
}