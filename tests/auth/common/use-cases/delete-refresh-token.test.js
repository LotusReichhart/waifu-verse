import {DeleteRefreshTokenUseCase} from "../../../../src/modules/auth/common/domain/use-cases/index.js";

describe("DeleteRefreshTokenUseCase", () => {
    let mockTokenService;
    let useCase;

    beforeEach(() => {
        mockTokenService = {
            deleteRefreshToken: jest.fn()
        };
        useCase = new DeleteRefreshTokenUseCase(mockTokenService);
    });

    it("gọi tokenService.deleteRefreshToken với token được truyền vào", async () => {
        const token = "fake-refresh-token";

        await useCase.execute(token);

        expect(mockTokenService.deleteRefreshToken).toHaveBeenCalledTimes(1);
        expect(mockTokenService.deleteRefreshToken).toHaveBeenCalledWith(token);
    });

    it("ném lỗi nếu tokenService.deleteRefreshToken thất bại", async () => {
        const token = "bad-token";
        mockTokenService.deleteRefreshToken.mockRejectedValue(new Error("delete failed"));

        await expect(useCase.execute(token)).rejects.toThrow("delete failed");
    });
});
