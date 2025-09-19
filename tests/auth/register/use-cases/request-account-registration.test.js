import {RequestAccountRegistrationUseCase} from "../../../../src/modules/auth/register/domain/use-cases/index.js";

jest.mock("../../../../src/shared/utils/otp-helper.js", () => ({
    generateOTP: jest.fn(() => "123456")
}));
jest.mock("../../../../src/shared/infra/transport/otp-template.js", () => ({
    buildOtpTemplate: jest.fn(() => ({ subject: "Mã OTP", html: "<p>123456</p>" }))
}));

describe("Chức năng đăng ký tài khoản", () => {
    let mockUserRepository;
    let mockOtpService;
    let mockMailerService;
    let useCase;

    beforeEach(() => {
        mockUserRepository = {
            getByEmail: jest.fn(),
            getByUsername: jest.fn()
        };
        mockOtpService = {
            checkLimit: jest.fn(),
            saveOTP: jest.fn()
        };
        mockMailerService = {
            sendMail: jest.fn()
        };
        useCase = new RequestAccountRegistrationUseCase(
            mockUserRepository,
            mockOtpService,
            mockMailerService
        );
    });

    it("nếu email, username, password hợp lệ thì gửi OTP và lưu thành công", async () => {
        const input = {
            email: "test@example.com",
            username: "tester123",
            password: "password123",
            i18n: {}
        };

        mockUserRepository.getByEmail.mockResolvedValue(null);
        mockUserRepository.getByUsername.mockResolvedValue(null);
        mockOtpService.checkLimit.mockResolvedValue({ allowed: true });
        mockMailerService.sendMail.mockResolvedValue(true);
        mockOtpService.saveOTP.mockResolvedValue(true);

        const result = await useCase.execute(input);

        expect(result.email).toBe(input.email);
        expect(mockUserRepository.getByEmail).toHaveBeenCalledWith({ email: input.email });
        expect(mockUserRepository.getByUsername).toHaveBeenCalledWith({ username: input.username });
        expect(mockOtpService.checkLimit).toHaveBeenCalledWith(input.email);
        expect(mockMailerService.sendMail).toHaveBeenCalledWith(expect.objectContaining({ to: input.email }));
        expect(mockOtpService.saveOTP).toHaveBeenCalledWith(expect.objectContaining({ email: input.email }));
    });

    it("nếu bỏ trống email, username hoặc password thì ném lỗi AppError", async () => {
        const input = { email: "", username: "", password: "", i18n: {} };

        await expect(useCase.execute(input)).rejects.toBeInstanceOf(Array); // vì use case ném mảng lỗi
    });

    it("nếu email đã tồn tại thì ném lỗi emailAlready", async () => {
        mockUserRepository.getByEmail.mockResolvedValue({ id: "123" });
        const input = { email: "exist@example.com", username: "tester123", password: "pass12345", i18n: {} };

        await expect(useCase.execute(input)).rejects.toThrow("emailAlready");
    });

    it("nếu username đã tồn tại thì ném lỗi usernameExists", async () => {
        mockUserRepository.getByEmail.mockResolvedValue(null);
        mockUserRepository.getByUsername.mockResolvedValue({ id: "456" });
        const input = { email: "test@example.com", username: "existUser", password: "pass12345", i18n: {} };

        await expect(useCase.execute(input)).rejects.toThrow("usernameExists");
    });

    it("nếu gửi mail thất bại thì ném lỗi serverError", async () => {
        mockUserRepository.getByEmail.mockResolvedValue(null);
        mockUserRepository.getByUsername.mockResolvedValue(null);
        mockOtpService.checkLimit.mockResolvedValue({ allowed: true });
        mockMailerService.sendMail.mockResolvedValue(false);
        const input = { email: "test@example.com", username: "tester123", password: "password123", i18n: {} };

        await expect(useCase.execute(input)).rejects.toThrow("serverError");
    });
});
