const cropModals = document.querySelectorAll('.crop-modal');

cropModals.forEach(modal => {
    let cropper = null;
    let cropMode = null;
    let onCropComplete = null;

    const cropImage = modal.querySelector('.crop-image');
    const cropSaveBtn = modal.querySelector('.crop-save');
    const cropCancelBtn = modal.querySelector('.crop-cancel');
    const imgInput = document.querySelector('.img-input');

    function openCropModal(imageSrc, mode = 'user-avatar', callback = null) {
        cropMode = mode;
        onCropComplete = callback;

        if (cropper) {
            cropper.destroy();
            cropper = null;
        }

        cropImage.src = imageSrc;
        modal.classList.remove('hidden');
        modal.classList.add('flex');

        cropper = new Cropper(cropImage, {
            aspectRatio: 1,
            viewMode: 1
        });
    }

    function closeCropModal() {
        modal.classList.add('hidden');
        modal.classList.remove('flex');

        if (cropper) {
            cropper.destroy();
            cropper = null;
        }

        if (imgInput) imgInput.value = '';
        cropImage.src = '';
    }

    cropCancelBtn.addEventListener('click', e => {
        e.preventDefault();
        closeCropModal();
    });

    cropSaveBtn.addEventListener('click', e => {
        e.preventDefault();
        if (!cropper) return;

        cropSaveBtn.disabled = true;
        cropSaveBtn.classList.remove('button-primary');
        cropSaveBtn.classList.add('button-disabled');
        cropSaveBtn.textContent = window.commonJson.title.loading;

        const canvas = cropper.getCroppedCanvas({
            width: 750,
            height: 750
        });
        const base64Image = canvas.toDataURL('image/png');

        if (cropMode === 'user-avatar') {
            const errorBox = document.querySelector('#upload-avatar-error');
            if (errorBox) errorBox.textContent = '';

            const formData = new FormData();
            formData.append('image', base64Image);

            fetch('/api/user/avatar', {
                method: 'POST',
                body: formData
            }).then(async res => {
                const data = await res.json();
                if (!res.ok) throw new Error(data.message || window.commonJson.error.somethingIsWrong);

                window.location.reload();
            }).catch(err => {
                if (errorBox) errorBox.textContent = err.message;
            }).finally(() => {
                closeCropModal();
                cropSaveBtn.disabled = false;
                cropSaveBtn.classList.remove('button-disabled');
                cropSaveBtn.classList.add('button-primary');
                cropSaveBtn.textContent = window.commonJson.title.save;
            });
        } else if (cropMode === 'preview') {
            if (typeof onCropComplete === 'function') {
                onCropComplete(base64Image);
            }
            closeCropModal();
            cropSaveBtn.disabled = false;
            cropSaveBtn.classList.remove('button-disabled');
            cropSaveBtn.classList.add('button-primary');
            cropSaveBtn.textContent = window.commonJson.title.save;
        }
    });

    modal.openCropModal = openCropModal;
});
