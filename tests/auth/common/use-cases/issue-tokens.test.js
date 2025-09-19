import { IssueTokensUseCase } from "../../../../src/modules/auth/common/domain/use-cases/index.js";

describe("Chức năng cấp phát accessToken & refreshToken", () => {
    let mockTokenService;
    let useCase;

    beforeEach(() => {
        mockTokenService = {
            issueTokens: jest.fn()
        };
        useCase = new IssueTokensUseCase(mockTokenService);
    });

    it("nếu truyền user hợp lệ thì phải trả về accessToken và refreshToken", async () => {
        const fakeUser = { id: "123", email: "test@example.com" };
        const fakeTokens = {
            accessToken: "access-abc",
            refreshToken: "refresh-xyz"
        };

        mockTokenService.issueTokens.mockResolvedValue(fakeTokens);

        const result = await useCase.execute(fakeUser);

        expect(result).toEqual(fakeTokens);
        expect(mockTokenService.issueTokens).toHaveBeenCalledTimes(1);
        expect(mockTokenService.issueTokens).toHaveBeenCalledWith(fakeUser);
    });

    it("nếu tokenService.issueTokens bị lỗi thì use case cũng phải ném lỗi ra", async () => {
        const fakeUser = { id: "999", email: "error@example.com" };

        mockTokenService.issueTokens.mockRejectedValue(new Error("không thể tạo token"));

        await expect(useCase.execute(fakeUser)).rejects.toThrow("không thể tạo token");
    });
});
