import { FindUserByEmailUseCase } from "../../../../src/modules/auth/common/domain/use-cases/index.js";

describe("Chức năng tìm người dùng theo email", () => {
    let mockUserRepository;
    let useCase;

    beforeEach(() => {
        // Tạo giả userRepository
        mockUserRepository = {
            getByEmail: jest.fn()
        };
        useCase = new FindUserByEmailUseCase(mockUserRepository);
    });

    it("nếu truyền vào email hợp lệ thì phải trả về thông tin user", async () => {
        const email = "test@example.com";
        const fakeUser = { id: "123", email };

        mockUserRepository.getByEmail.mockResolvedValue(fakeUser);

        const result = await useCase.execute({ email });

        expect(result).toEqual(fakeUser);
        expect(mockUserRepository.getByEmail).toHaveBeenCalledTimes(1);
        expect(mockUserRepository.getByEmail).toHaveBeenCalledWith({ email });
    });

    it("nếu không tìm thấy user thì trả về null", async () => {
        const email = "notfound@example.com";

        mockUserRepository.getByEmail.mockResolvedValue(null);

        const result = await useCase.execute({ email });

        expect(result).toBeNull();
    });

    it("nếu repository.getByEmail bị lỗi thì use case cũng phải ném lỗi ra", async () => {
        const email = "error@example.com";
        mockUserRepository.getByEmail.mockRejectedValue(new Error("lỗi database"));

        await expect(useCase.execute({ email })).rejects.toThrow("lỗi database");
    });
});
