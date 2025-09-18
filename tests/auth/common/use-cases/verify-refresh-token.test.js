import { VerifyRefreshTokenUseCase } from "../../../../src/modules/auth/common/domain/use-cases/index.js";

describe("Chức năng xác thực refresh token", () => {
    let mockTokenService;
    let useCase;

    beforeEach(() => {
        mockTokenService = {
            verifyRefreshToken: jest.fn()
        };
        useCase = new VerifyRefreshTokenUseCase(mockTokenService);
    });

    it("nếu token hợp lệ thì trả về dữ liệu verify", async () => {
        const token = "valid-refresh-token";
        const fakeResult = { userId: "123", valid: true };

        mockTokenService.verifyRefreshToken.mockResolvedValue(fakeResult);

        const result = await useCase.execute(token);

        expect(result).toEqual(fakeResult);
        expect(mockTokenService.verifyRefreshToken).toHaveBeenCalledTimes(1);
        expect(mockTokenService.verifyRefreshToken).toHaveBeenCalledWith(token);
    });

    it("nếu token không hợp lệ thì ném lỗi", async () => {
        const token = "invalid-token";

        mockTokenService.verifyRefreshToken.mockRejectedValue(new Error("token không hợp lệ"));

        await expect(useCase.execute(token)).rejects.toThrow("token không hợp lệ");
    });
});
