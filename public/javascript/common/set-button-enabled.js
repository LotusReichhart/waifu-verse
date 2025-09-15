export function setButtonEnabled(btn, enabled) {
    if (!btn) return;
    btn.disabled = !enabled;
    btn.classList.toggle('button-primary', enabled);
    btn.classList.toggle('button-disabled', !enabled);
}