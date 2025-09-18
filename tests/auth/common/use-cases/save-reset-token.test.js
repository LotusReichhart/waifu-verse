import { SaveResetTokenUseCase } from "../../../../src/modules/auth/common/domain/use-cases/index.js";

describe("Chức năng lưu reset token", () => {
    let mockTokenService;
    let useCase;

    beforeEach(() => {
        mockTokenService = {
            saveResetToken: jest.fn()
        };
        useCase = new SaveResetTokenUseCase(mockTokenService);
    });

    it("nếu truyền email hợp lệ thì phải trả về resetToken", async () => {
        const email = "test@example.com";
        const fakeToken = { resetToken: "abc123" };

        mockTokenService.saveResetToken.mockResolvedValue(fakeToken);

        const result = await useCase.execute({ email });

        expect(result).toEqual(fakeToken);
        expect(mockTokenService.saveResetToken).toHaveBeenCalledTimes(1);
        expect(mockTokenService.saveResetToken).toHaveBeenCalledWith({ email });
    });

    it("nếu tokenService.saveResetToken gặp lỗi thì use case cũng phải ném lỗi ra", async () => {
        const email = "fail@example.com";

        mockTokenService.saveResetToken.mockRejectedValue(new Error("không thể lưu token"));

        await expect(useCase.execute({ email })).rejects.toThrow("không thể lưu token");
    });
});
