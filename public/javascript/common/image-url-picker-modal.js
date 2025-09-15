const imageUrlPickerModals = document.querySelectorAll('.image-url-picker-modal');

imageUrlPickerModals.forEach(modal => {

    const urlInput = modal.querySelector('.image-url-input');
    const urlError = modal.querySelector('.url-error');
    const cancelBtn = modal.querySelector('.cancel-url-btn');
    const confirmBtn = modal.querySelector('.confirm-url-btn');

    let onConfirm = null;

    function openImageUrlModal(callback) {
        onConfirm = callback;
        urlInput.value = '';
        urlError.classList.add('hidden');
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        urlInput.focus();
    }

    function closeImageUrlModal() {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }

    cancelBtn.addEventListener('click', (e) => {
        e.preventDefault();
        closeImageUrlModal();
    });

    confirmBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const url = urlInput.value.trim();
        const urlPattern = /^https?:\/\/.+/i;

        if (!urlPattern.test(url)) {
            urlError.textContent = window.commonJson.error.invalidUrl;
            urlError.classList.remove('hidden');
            return;
        }

        const testImg = new Image();
        testImg.crossOrigin = 'anonymous';
        testImg.onload = () => {
            urlError.classList.add('hidden');
            closeImageUrlModal();

            if (typeof onConfirm === 'function') {
                onConfirm(url);
            }
        };
        testImg.onerror = () => {
            urlError.textContent = window.commonJson.error.couldNotBeLoaded;
            urlError.classList.remove('hidden');
        };
        testImg.src = url;
    });

    modal.openImageUrlModal = openImageUrlModal;
});