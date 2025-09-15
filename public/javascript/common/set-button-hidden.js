export function setButtonHidden(btn, isHidden) {
    if (!btn) return;
    btn.classList.toggle("hidden", isHidden);
}