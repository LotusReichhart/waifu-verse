import {setButtonEnabled} from "../common/set-button-enabled.js";
import {startCountdown} from "../common/start-countdown.js";
import {setTextButtonEnabled} from "../common/set-text-button-enabled.js";
import {antiCopyPaste} from "../common/anti-copy-paste.js";
import {togglePassword} from "../common/toggle-password.js";
import {showMessageModal} from "../common/show-message-modal.js";
import {handleOtpInputs} from "../common/handle-otp-inputs.js";

document.addEventListener("DOMContentLoaded", () => {
    // Step Email
    const stepSubmit = document.querySelector("#step-submit");
    if (stepSubmit) {
        const form = stepSubmit.querySelector("#forgot-form");
        const emailInput = form.querySelector('input[name="email"]');
        const submitButton = form.querySelector("button[type='submit']");

        setButtonEnabled(submitButton, emailInput.value.trim() !== "");

        emailInput.addEventListener("input", () => {
            setButtonEnabled(submitButton, emailInput.value.trim() !== "");
        });

        form.addEventListener("submit", async (e) => {
            const btn = e.submitter;
            setButtonEnabled(btn, false);
            btn.textContent = window.commonJson.label.loading.toUpperCase();
        });
    }

    // Step Otp
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
            resendTitle: window.forgotPasswordJson.main.message.resendOtpIn,
            btnTitle: window.forgotPasswordJson.main.label.resendOtp,
        });

        resendBtn.addEventListener("click", async () => {
            setTextButtonEnabled(resendBtn, false);
            globalError.classList.add('hidden');

            try {
                const res = await fetch(`/api/auth/otp/new`, {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({email: emailInput.value, step: "forgotPassword"})
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
                        resendTitle: window.forgotPasswordJson.main.message.resendOtpIn,
                        btnTitle: window.forgotPasswordJson.main.label.resendOtp,
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

    const stepNewPassword = document.querySelector("#step-new-password");
    if (stepNewPassword) {
        const newPasswordInput = stepNewPassword.querySelector("#newPassword");
        const confirmPasswordInput = stepNewPassword.querySelector("#confirmPassword");
        const changePasswordSubmit = stepNewPassword.querySelector("#change-password-submit");
        const newPasswordError = stepNewPassword.querySelector("p#newPasswordError");
        const confirmPasswordError = stepNewPassword.querySelector("p#confirmPasswordError");
        const globalError = stepNewPassword.querySelector("div#errorGlobal");

        [newPasswordInput, confirmPasswordInput].forEach(input => {
            antiCopyPaste(input);
        });

        togglePassword(newPasswordInput, stepNewPassword.querySelector("#toggleNewPassword"));
        togglePassword(confirmPasswordInput, stepNewPassword.querySelector("#toggleConfirmPassword"));

        function validatePassword() {
            const valid = newPasswordInput.value
                && confirmPasswordInput.value
                && newPasswordInput.value === confirmPasswordInput.value;
            setButtonEnabled(changePasswordSubmit, valid);
        }

        newPasswordInput.addEventListener("input", validatePassword);
        confirmPasswordInput.addEventListener("input", validatePassword);

        changePasswordSubmit.addEventListener("click", async (e) => {
            e.preventDefault();
            setButtonEnabled(changePasswordSubmit, false);
            changePasswordSubmit.textContent = window.commonJson.label.loading.toUpperCase();

            const payload = {
                password: newPasswordInput.value,
                confirmPassword: confirmPasswordInput.value,
                step: "forgotPassword"
            };

            try {
                const res = await fetch("/api/auth/password/new", {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(payload),
                });

                const json = await res.json();

                if (!res.ok) {
                    if (res.status === 429) {
                        globalError.textContent = json.global || window.commonJson.errors["tooManyRequest"];
                        globalError.classList.remove('hidden');
                    } else {
                        if (json.global) {
                            globalError.textContent = json.global || window.commonJson.errors["somethingIsWrong"];
                            globalError.classList.remove('hidden');
                        }
                        newPasswordError.textContent = json.password || "";
                        confirmPasswordError.textContent = json.confirmPassword || "";
                    }

                    setButtonEnabled(changePasswordSubmit, true);
                    changePasswordSubmit.textContent = forgotPasswordJson.main.label.changeNewPassword.toUpperCase();
                } else {
                    showMessageModal({
                        message: json.message,
                        buttonTitle: window.forgotPasswordJson.main.label["backToLogin"],
                        href: "/auth/login"
                    });
                }

            } catch (err) {
                console.log(err);
                globalError.textContent = window.commonJson.errors["somethingIsWrong"];
                setButtonEnabled(changePasswordSubmit, true);
                changePasswordSubmit.textContent = forgotPasswordJson.main.label.changeNewPassword.toUpperCase();
            }
        });
    }
});


