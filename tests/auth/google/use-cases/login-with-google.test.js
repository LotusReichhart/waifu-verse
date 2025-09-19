import {LoginWithGoogleUseCase} from "../../../../src/modules/auth/google/domain/use-cases/index.js";
import {AppError} from "../../../../src/shared/utils/app-error.js";

describe("Chức năng đăng nhập bằng Google", () => {
    let mockUserRepository;
    let useCase;

    beforeEach(() => {
        mockUserRepository = {
            getById: jest.fn(),
            update: jest.fn()
        };
        useCase = new LoginWithGoogleUseCase(mockUserRepository);
    });

    it("nếu user tồn tại thì trả về user và cập nhật lastLogin", async () => {
        const userId = "123";
        const fakeUser = { id: userId, lastLogin: null };

        mockUserRepository.getById.mockResolvedValue(fakeUser);
        mockUserRepository.update.mockResolvedValue({ ...fakeUser, lastLogin: new Date() });

        const result = await useCase.execute(userId);

        expect(result.user).toBeDefined();
        expect(result.user.id).toBe(userId);
        expect(mockUserRepository.getById).toHaveBeenCalledWith({ userId });
        expect(mockUserRepository.update).toHaveBeenCalledTimes(1);
        expect(result.user.lastLogin).toBeInstanceOf(Date);
    });

    it("nếu user không tồn tại thì ném AppError accountNotExits", async () => {
        const userId = "999";

        mockUserRepository.getById.mockResolvedValue(null);

        await expect(useCase.execute(userId))
            .rejects.toMatchObject({ code: "accountNotExits" });
    });

    it("nếu repository ném lỗi bất ngờ thì ném AppError mặc định", async () => {
        const userId = "123";

        mockUserRepository.getById.mockRejectedValue(new Error("DB error"));

        await expect(useCase.execute(userId))
            .rejects.toBeInstanceOf(AppError);
    });
});
