import {antiCopyPaste} from "../common/anti-copy-paste.js";
import {setButtonEnabled} from "../common/set-button-enabled.js";
import {togglePassword} from "../common/toggle-password.js";
import {startCountdown} from "../common/start-countdown.js";
import {setTextButtonEnabled} from "../common/set-text-button-enabled.js";
import {handleOtpInputs} from "../common/handle-otp-inputs.js";

document.addEventListener("DOMContentLoaded", () => {

    const stepSubmit = document.querySelector("#step-submit");
    if (stepSubmit) {
        const form = stepSubmit.querySelector("#register-form");
        const emailInput = document.querySelector('input[name="email"]');
        const usernameInput = document.querySelector('input[name="username"]');
        const passwordInput = document.querySelector('input[name="password"]');
        const isAgreeTermsInput = document.querySelector('#isAgreeTerms');
        const submitButton = document.querySelector('button[type="submit"]');
        const togglePasswordButton = document.querySelector('#togglePassword');

        [passwordInput].forEach(input => {
            antiCopyPaste(input);
        });

        function validateInputs() {
            const email = emailInput.value.trim();
            const username = usernameInput.value.trim();
            const password = passwordInput.value.trim();
            const isAgreeTerms = isAgreeTermsInput.checked;

            setButtonEnabled(submitButton, email !== "" && username !== "" && password !== "" && isAgreeTerms === true);
        }

        emailInput.addEventListener("input", validateInputs);
        passwordInput.addEventListener("input", validateInputs);
        isAgreeTermsInput.addEventListener("change", validateInputs);

        validateInputs();

        togglePassword(passwordInput, togglePasswordButton);

        form.addEventListener("submit", async (e) => {
            const btn = e.submitter;
            setButtonEnabled(btn, false);
            btn.textContent = window.commonJson.label.loading.toUpperCase();
        });
    }

    const stepVerify = document.querySelector("#step-verify");
    if (stepVerify) {
        const form = stepVerify.querySelector("form");
        const otpFields = form.querySelectorAll(".otp-input");
        const otpSubmit = form.querySelector("button#otpSubmit");
        const resendBtn = form.querySelector("button#resendOtp");
        const emailInput = form.querySelector("input[name='email']");
        const durationInput = form.querySelector("input[name='duration']");
        const resendOtpError = form.querySelector("span#resendOtpError");
        const globalError = form.querySelector("div#errorGlobal");

        let countdown = null;

        startCountdown({
            countdown,
            duration: Number(window.duration) || 59,
            input: durationInput,
            btn: resendBtn,
            resendTitle: window.registerJson.main.message.resendOtpIn,
            btnTitle: window.registerJson.main.label.resendOtp,
        });

        resendBtn.addEventListener("click", async () => {
            setTextButtonEnabled(resendBtn, false);
            globalError.classList.add('hidden');

            try {
                const res = await fetch(`/api/auth/otp/new`, {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({email: emailInput.value, step: "register"})
                });
                const json = await res.json();

                if (!res.ok) {
                    if (res.status === 429) {
                        globalError.textContent = json.global || window.commonJson.errors["tooManyRequest"];
                        globalError.classList.remove('hidden');
                    } else {
                        resendOtpError.textContent = json.message || window.commonJson.errors["somethingIsWrong"];
                    }
                    setTextButtonEnabled(resendBtn, true);
                } else {
                    startCountdown({
                        countdown,
                        duration: 59,
                        input: durationInput,
                        btn: resendBtn,
                        resendTitle: window.registerJson.main.message.resendOtpIn,
                        btnTitle: window.registerJson.main.label.resendOtp,
                    });
                    resendOtpError.textContent = "";
                    globalError.classList.add('hidden');
                }
            } catch (e) {
                resendOtpError.textContent = window.commonJson.errors["somethingIsWrong"];
                setTextButtonEnabled(resendBtn, true);
            }
        });

        handleOtpInputs(otpFields, (otpValue) => {
            form.querySelector("#otpValue").value = otpValue;
            setButtonEnabled(otpSubmit, otpValue.length === 6);
        });

        form.addEventListener("submit", async (e) => {
            const btn = e.submitter;
            setButtonEnabled(btn, false);
            btn.textContent = window.commonJson.label.loading.toUpperCase();
        });
    }
});
