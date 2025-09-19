import {VerifyForgotPasswordUseCase} from "../../../../src/modules/auth/forgot-password/domain/use-cases/index.js";
import {AppError} from "../../../../src/shared/utils/app-error.js";

describe("Chức năng xác thực OTP quên mật khẩu", () => {
    let mockOtpService;
    let useCase;

    beforeEach(() => {
        mockOtpService = {
            verifyOTP: jest.fn()
        };
        useCase = new VerifyForgotPasswordUseCase(mockOtpService);
    });

    it("nếu email và OTP hợp lệ thì trả về success", async () => {
        const email = "test@example.com";
        const otp = "123456";

        mockOtpService.verifyOTP.mockResolvedValue({ success: true });

        const result = await useCase.execute({ email, otp });

        expect(result).toEqual({ success: true });
        expect(mockOtpService.verifyOTP).toHaveBeenCalledWith({ email, otp });
    });

    it("nếu email rỗng thì ném lỗi AppError", async () => {
        await expect(useCase.execute({ email: "", otp: "123456" }))
            .rejects.toBeInstanceOf(AppError);
    });

    it("nếu email không hợp lệ thì ném lỗi AppError", async () => {
        await expect(useCase.execute({ email: "abc", otp: "123456" }))
            .rejects.toBeInstanceOf(AppError);
    });

    it("nếu OTP rỗng thì ném lỗi otpEmpty", async () => {
        await expect(useCase.execute({ email: "test@example.com", otp: "" }))
            .rejects.toMatchObject({ code: "otpEmpty" });
    });

    it("nếu OTP sai thì ném lỗi incorrectOtp", async () => {
        const email = "test@example.com";
        const otp = "000000";

        mockOtpService.verifyOTP.mockResolvedValue({ success: false });

        await expect(useCase.execute({ email, otp }))
            .rejects.toMatchObject({ code: "incorrectOtp" });
    });

    it("nếu otpService bị lỗi bất ngờ thì ném AppError mặc định", async () => {
        const email = "test@example.com";
        const otp = "123456";

        mockOtpService.verifyOTP.mockRejectedValue(new Error("db error"));

        await expect(useCase.execute({ email, otp }))
            .rejects.toBeInstanceOf(AppError);
    });
});
