import {LoginWithUsernameOrEmailUseCase} from "../../../../src/modules/auth/login/domain/use-cases/index.js";
import {AppError} from "../../../../src/shared/utils/app-error.js";
import argon2 from "argon2";

jest.mock("argon2");

describe("Chức năng đăng nhập bằng email hoặc username", () => {
    let mockUserRepository;
    let useCase;

    beforeEach(() => {
        mockUserRepository = {
            getByEmail: jest.fn(),
            getByUsername: jest.fn(),
            update: jest.fn()
        };
        useCase = new LoginWithUsernameOrEmailUseCase(mockUserRepository);
    });

    it("nếu input là email hợp lệ và mật khẩu đúng thì trả về user", async () => {
        const input = "test@example.com";
        const password = "123456";
        const fakeUser = { email: input, password: "hashed", lastLogin: null };

        mockUserRepository.getByEmail.mockResolvedValue(fakeUser);
        argon2.verify.mockResolvedValue(true);
        mockUserRepository.update.mockResolvedValue({ ...fakeUser, lastLogin: new Date() });

        const result = await useCase.execute({ input, password });

        expect(result.user).toBeDefined();
        expect(result.user.email).toBe(input);
        expect(result.user.lastLogin).toBeInstanceOf(Date);
        expect(mockUserRepository.update).toHaveBeenCalledTimes(1);
    });

    it("nếu input rỗng thì ném lỗi emailOrUsernameEmpty", async () => {
        await expect(useCase.execute({ input: "", password: "123" }))
            .rejects.toMatchObject({ code: "emailOrUsernameEmpty" });
    });

    it("nếu mật khẩu rỗng thì ném lỗi passwordEmpty", async () => {
        await expect(useCase.execute({ input: "test@example.com", password: "" }))
            .rejects.toMatchObject({ code: "passwordEmpty" });
    });

    it("nếu email không đăng ký thì ném lỗi emailNotRegistered", async () => {
        const input = "notfound@example.com";
        mockUserRepository.getByEmail.mockResolvedValue(null);

        await expect(useCase.execute({ input, password: "123" }))
            .rejects.toMatchObject({ code: "emailNotRegistered" });
    });

    it("nếu username không tồn tại thì ném lỗi accountNotExits", async () => {
        const input = "unknownUser";
        mockUserRepository.getByUsername.mockResolvedValue(null);

        await expect(useCase.execute({ input, password: "123" }))
            .rejects.toMatchObject({ code: "accountNotExits" });
    });

    it("nếu mật khẩu sai thì ném lỗi incorrectPassword", async () => {
        const input = "test@example.com";
        const fakeUser = { email: input, password: "hashed", lastLogin: null };

        mockUserRepository.getByEmail.mockResolvedValue(fakeUser);
        argon2.verify.mockResolvedValue(false);

        await expect(useCase.execute({ input, password: "wrong" }))
            .rejects.toMatchObject({ code: "incorrectPassword" });
    });

    it("nếu repository ném lỗi bất ngờ thì use-case ném AppError mặc định", async () => {
        mockUserRepository.getByEmail.mockRejectedValue(new Error("DB lỗi"));
        await expect(useCase.execute({ input: "test@example.com", password: "123" }))
            .rejects.toBeInstanceOf(AppError);
    });
});
