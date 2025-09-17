import {antiCopyPaste} from "../common/anti-copy-paste.js";
import {setButtonEnabled} from "../common/set-button-enabled.js";
import {togglePassword} from "../common/toggle-password.js";


document.addEventListener("DOMContentLoaded", () => {
    const input = document.querySelector('input[name="input"]');
    const passwordInput = document.querySelector('input[name="password"]');
    const submitButton = document.querySelector('button[type="submit"]');
    const togglePasswordButton = document.querySelector('#togglePassword');

    [passwordInput].forEach(input => {
        antiCopyPaste(input);
    });

    function validateInputs() {
        const email = input.value.trim();
        const password = passwordInput.value.trim();
        setButtonEnabled(submitButton, email !== "" && password !== "");
    }

    input.addEventListener("input", validateInputs);
    passwordInput.addEventListener("input", validateInputs);

    validateInputs();

    togglePassword(passwordInput, togglePasswordButton);
})
