import { VerifyResetTokenUseCase } from "../../../../src/modules/auth/common/domain/use-cases/index.js";

describe("Chức năng xác thực reset token", () => {
    let mockTokenService;
    let useCase;

    beforeEach(() => {
        mockTokenService = {
            verifyResetToken: jest.fn()
        };
        useCase = new VerifyResetTokenUseCase(mockTokenService);
    });

    it("nếu token hợp lệ thì trả về dữ liệu verify", async () => {
        const token = "valid-reset-token";
        const fakeResult = { email: "test@example.com", valid: true };

        mockTokenService.verifyResetToken.mockResolvedValue(fakeResult);

        const result = await useCase.execute(token);

        expect(result).toEqual(fakeResult);
        expect(mockTokenService.verifyResetToken).toHaveBeenCalledTimes(1);
        expect(mockTokenService.verifyResetToken).toHaveBeenCalledWith(token);
    });

    it("nếu token không hợp lệ thì ném lỗi", async () => {
        const token = "invalid-token";

        mockTokenService.verifyResetToken.mockRejectedValue(new Error("token không hợp lệ"));

        await expect(useCase.execute(token)).rejects.toThrow("token không hợp lệ");
    });
});
