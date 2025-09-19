import {setTextButtonEnabled} from "./set-text-button-enabled.js";

export function startCountdown({countdown, duration, input, btn, resendTitle, btnTitle}) {
    let remaining = duration;

    input.value = duration;

    setTextButtonEnabled(btn, false);
    btn.textContent = `${resendTitle} ${remaining}s`;

    countdown = setInterval(() => {
        remaining--;
        if (remaining > 0) {
            btn.textContent = `${resendTitle} ${remaining}s`;
            input.value = remaining;
        } else {
            clearInterval(countdown);
            setTextButtonEnabled(btn, true);
            btn.textContent = btnTitle;
            input.value = 0;
        }
    }, 1000);
}