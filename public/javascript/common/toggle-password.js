import {setButtonHidden} from "./set-button-hidden.js";

export function togglePassword(input, toggleBtn) {
    const [eyeOpen, eyeClosed] = toggleBtn.querySelectorAll("svg");

    toggleBtn.addEventListener("click", () => {
        const isPassword = input.type === "password";
        input.type = isPassword ? "text" : "password";
        setButtonHidden(eyeOpen, isPassword);
        setButtonHidden(eyeClosed, !isPassword);
    });
}