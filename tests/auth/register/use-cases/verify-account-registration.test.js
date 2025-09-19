import {VerifyAccountRegistration} from "../../../../src/modules/auth/register/domain/use-cases/index.js";
import { AppError } from "../../../../src/shared/utils/app-error.js";
import { UserEntity } from "../../../../src/core/domain/entities/user-entity.js";

// Mock loggerHelper để tránh in log trong test
jest.mock("../../../../src/shared/utils/logger-helper.js", () => ({
    loggerHelper: { error: jest.fn() }
}));

describe("Xác thực đăng ký tài khoản", () => {
    let mockUserRepository;
    let mockOtpService;
    let useCase;

    beforeEach(() => {
        mockUserRepository = {
            create: jest.fn()
        };
        mockOtpService = {
            verifyOTP: jest.fn()
        };
        useCase = new VerifyAccountRegistration(mockUserRepository, mockOtpService);
    });

    it("nếu OTP hợp lệ và dữ liệu đầy đủ, tạo user thành công", async () => {
        const input = { email: "test@example.com", otp: "123456" };
        const otpData = { email: input.email, username: "tester", password: "pass123" };

        mockOtpService.verifyOTP.mockResolvedValue({ success: true, data: otpData });
        mockUserRepository.create.mockResolvedValue({ id: "1", ...otpData });

        const result = await useCase.execute(input);

        expect(result.user).toBeDefined();
        expect(result.user.email).toBe(input.email);
        expect(mockOtpService.verifyOTP).toHaveBeenCalledWith({ otp: input.otp, email: input.email });
        expect(mockUserRepository.create).toHaveBeenCalledWith(expect.objectContaining({
            userEntity: expect.any(UserEntity)
        }));
    });

    it("nếu email trống hoặc không hợp lệ thì ném lỗi AppError", async () => {
        await expect(useCase.execute({ email: "", otp: "123456" })).rejects.toBeInstanceOf(AppError);
        await expect(useCase.execute({ email: "invalidEmail", otp: "123456" })).rejects.toBeInstanceOf(AppError);
    });

    it("nếu OTP trống thì ném lỗi otpEmpty", async () => {
        await expect(useCase.execute({ email: "test@example.com", otp: "" }))
            .rejects.toThrow(expect.objectContaining({ key: "otp", code: "otpEmpty" }));
    });

    it("nếu OTP không đúng thì ném lỗi incorrectOtp", async () => {
        mockOtpService.verifyOTP.mockResolvedValue({ success: false, data: null });
        await expect(useCase.execute({ email: "test@example.com", otp: "wrongOtp" }))
            .rejects.toThrow(expect.objectContaining({ key: "otp", code: "incorrectOtp" }));
    });

    it("nếu dữ liệu từ OTP không có data thì ném lỗi serverError", async () => {
        mockOtpService.verifyOTP.mockResolvedValue({ success: true, data: null });
        await expect(useCase.execute({ email: "test@example.com", otp: "123456" }))
            .rejects.toThrow(expect.objectContaining({ key: "global", code: "serverError" }));
    });

    it("nếu tạo user thất bại thì ném lỗi serverError", async () => {
        const otpData = { email: "test@example.com", username: "tester", password: "pass123" };
        mockOtpService.verifyOTP.mockResolvedValue({ success: true, data: otpData });
        mockUserRepository.create.mockResolvedValue(null);

        await expect(useCase.execute({ email: "test@example.com", otp: "123456" }))
            .rejects.toThrow(expect.objectContaining({ key: "otp", code: "serverError" }));
    });
});
