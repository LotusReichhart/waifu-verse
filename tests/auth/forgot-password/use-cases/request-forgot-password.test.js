import {RequestForgotPasswordUseCase} from "../../../../src/modules/auth/forgot-password/domain/use-cases/index.js";

describe("Chức năng yêu cầu quên mật khẩu", () => {
    let mockUserRepository;
    let mockOtpService;
    let mockMailerService;
    let useCase;

    beforeEach(() => {
        mockUserRepository = { getByEmail: jest.fn() };
        mockOtpService = { checkLimit: jest.fn(), saveOTP: jest.fn() };
        mockMailerService = { sendMail: jest.fn() };

        useCase = new RequestForgotPasswordUseCase(
            mockUserRepository,
            mockOtpService,
            mockMailerService
        );
    });

    it("nếu email hợp lệ và tồn tại user thì gửi OTP thành công", async () => {
        const email = "test@example.com";
        const i18n = { otpMessage: "Mã OTP" };

        mockUserRepository.getByEmail.mockResolvedValue({ id: "123", email });
        mockOtpService.checkLimit.mockResolvedValue({ allowed: true });
        mockMailerService.sendMail.mockResolvedValue(true);
        mockOtpService.saveOTP.mockResolvedValue(true);

        const result = await useCase.execute({ email, i18n });

        expect(result).toEqual({ email });
        expect(mockUserRepository.getByEmail).toHaveBeenCalledWith({ email });
        expect(mockOtpService.checkLimit).toHaveBeenCalledWith(email);
        expect(mockMailerService.sendMail).toHaveBeenCalled();
        expect(mockOtpService.saveOTP).toHaveBeenCalled();
    });

    it("nếu email rỗng thì ném lỗi emailEmpty", async () => {
        await expect(useCase.execute({ email: "", i18n: {} }))
            .rejects.toMatchObject({ code: "emailEmpty" });
    });

    it("nếu email không hợp lệ thì ném lỗi emailInvalid", async () => {
        await expect(useCase.execute({ email: "abc", i18n: {} }))
            .rejects.toMatchObject({ code: "emailInvalid" });
    });

    it("nếu user không tồn tại thì ném lỗi emailNotRegistered", async () => {
        const email = "notfound@example.com";
        mockUserRepository.getByEmail.mockResolvedValue(null);

        await expect(useCase.execute({ email, i18n: {} }))
            .rejects.toMatchObject({ code: "emailNotRegistered" });
    });

    it("nếu vượt quá giới hạn OTP thì ném lỗi otpTooManyRequest", async () => {
        const email = "test@example.com";
        mockUserRepository.getByEmail.mockResolvedValue({ id: "123", email });
        mockOtpService.checkLimit.mockResolvedValue({ allowed: false });

        await expect(useCase.execute({ email, i18n: {} }))
            .rejects.toMatchObject({ code: "otpTooManyRequest" });
    });

    it("nếu gửi mail thất bại thì ném lỗi serverError", async () => {
        const email = "test@example.com";
        mockUserRepository.getByEmail.mockResolvedValue({ id: "123", email });
        mockOtpService.checkLimit.mockResolvedValue({ allowed: true });
        mockMailerService.sendMail.mockResolvedValue(false);

        await expect(useCase.execute({ email, i18n: {} }))
            .rejects.toMatchObject({ code: "serverError" });
    });
});
