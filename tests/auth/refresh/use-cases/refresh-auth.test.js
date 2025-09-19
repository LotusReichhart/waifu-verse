import {RefreshAuthUseCase} from "../../../../src/modules/auth/refresh/domain/use-cases/index.js";
import { createAccessToken } from "../../../../src/shared/utils/token-helper.js";

// Mock createAccessToken
jest.mock("../../../../src/shared/utils/token-helper.js", () => ({
    createAccessToken: jest.fn(() => "fake-access-token")
}));

describe("Chức năng làm mới token đăng nhập", () => {
    let mockUserRepository;
    let useCase;

    beforeEach(() => {
        mockUserRepository = {
            getById: jest.fn()
        };
        useCase = new RefreshAuthUseCase(mockUserRepository);
    });

    it("nếu không có userId thì trả về accessToken null", async () => {
        const result = await useCase.execute({ userId: null });
        expect(result.accessToken).toBeNull();
    });

    it("nếu userId không tồn tại trong hệ thống thì trả về accessToken null", async () => {
        mockUserRepository.getById.mockResolvedValue(null);

        const result = await useCase.execute({ userId: "123" });
        expect(result.accessToken).toBeNull();
        expect(mockUserRepository.getById).toHaveBeenCalledWith({ userId: "123" });
    });

    it("nếu user tồn tại thì trả về accessToken hợp lệ", async () => {
        const fakeUser = { id: "123", email: "test@example.com" };
        mockUserRepository.getById.mockResolvedValue(fakeUser);

        const result = await useCase.execute({ userId: "123" });

        expect(result.accessToken).toBe("fake-access-token");
        expect(mockUserRepository.getById).toHaveBeenCalledTimes(1);
        expect(createAccessToken).toHaveBeenCalledWith(fakeUser);
    });

    it("nếu repository bị lỗi thì use case cũng phải ném lỗi ra", async () => {
        mockUserRepository.getById.mockRejectedValue(new Error("lỗi database"));

        await expect(useCase.execute({ userId: "123" })).rejects.toThrow("lỗi database");
    });
});
