export function handleOtpInputs(inputs, callback) {
    inputs.forEach((input, index, arr) => {
        input.addEventListener("input", () => {
            input.value = input.value.replace(/[^0-9]/g, "");
            if (input.value && index < arr.length - 1) arr[index + 1].focus();
            validateOtp();
        });

        input.addEventListener("keydown", (e) => {
            if (e.key === "Backspace" && !input.value && index > 0) arr[index - 1].focus();
        });

        input.addEventListener("paste", (e) => {
            const pasteData = e.clipboardData.getData("text").replace(/[^0-9]/g, "");
            if (!pasteData) return;
            e.preventDefault();

            pasteData.split("").forEach((char, i) => {
                if (i < arr.length) arr[i].value = char;
            });

            const lastFilled = Math.min(pasteData.length, arr.length) - 1;
            if (lastFilled >= 0) arr[lastFilled].focus();
            validateOtp();
        });
    });

    function validateOtp() {
        const otpValue = Array.from(inputs).map(i => i.value).join("");
        if (typeof callback === "function") {
            callback(otpValue);
        }
    }
}