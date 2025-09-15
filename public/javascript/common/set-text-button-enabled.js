export function setTextButtonEnabled(btn, enabled) {
    if (!btn) return;
    btn.disabled = !enabled;
    btn.classList.toggle('text-primary', enabled);
    btn.classList.toggle('hover:underline', enabled);
    btn.classList.toggle('text-disabled', !enabled);
}