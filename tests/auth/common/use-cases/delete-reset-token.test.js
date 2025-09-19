import {DeleteResetTokenUseCase} from "../../../../src/modules/auth/common/domain/use-cases/index.js";

describe("Chức năng xoá reset token", () => {
    let mockTokenService;
    let useCase;

    beforeEach(() => {
        // Giả lập tokenService
        mockTokenService = {
            deleteResetToken: jest.fn()
        };
        useCase = new DeleteResetTokenUseCase(mockTokenService);
    });

    it("nếu truyền vào một reset token hợp lệ thì phải gọi tokenService.deleteResetToken", async () => {
        const token = "valid-reset-token";

        await useCase.execute(token);

        expect(mockTokenService.deleteResetToken).toHaveBeenCalledTimes(1);
        expect(mockTokenService.deleteResetToken).toHaveBeenCalledWith(token);
    });

    it("nếu tokenService.deleteResetToken gặp lỗi thì use case cũng phải ném ra lỗi đó", async () => {
        const token = "invalid-token";
        mockTokenService.deleteResetToken.mockRejectedValue(new Error("xóa thất bại"));

        await expect(useCase.execute(token)).rejects.toThrow("xóa thất bại");
    });
});
