import {CreateNewUserUseCase} from "../../../../src/modules/auth/common/domain/use-cases/index.js";
import {UserEntity} from "../../../../src/core/domain/entities/user-entity.js";

describe("CreateNewUserUseCase", () => {
    let mockUserRepository;
    let useCase;

    beforeEach(() => {
        mockUserRepository = {
            create: jest.fn()
        };
        useCase = new CreateNewUserUseCase(mockUserRepository);
    });

    it("tạo user mới khi dữ liệu hợp lệ", async () => {
        const input = {
            email: "test@example.com",
            username: "tester",
            password: "hashedPassword",
            avatar: "http://example.com/avatar.png",
            name: "Tester"
        };

        const fakeUser = { id: "123", ...input };

        mockUserRepository.create.mockResolvedValue(fakeUser);

        const result = await useCase.execute(input);

        // kiểm tra kết quả trả về
        expect(result).toEqual(fakeUser);

        // kiểm tra repo.create được gọi với UserEntity
        expect(mockUserRepository.create).toHaveBeenCalledTimes(1);
        const callArg = mockUserRepository.create.mock.calls[0][0];
        expect(callArg.userEntity).toBeInstanceOf(UserEntity);
        expect(callArg.userEntity.email).toBe(input.email);
    });

    it("nên ném lỗi nếu repository.create thất bại", async () => {
        const input = {
            email: "fail@example.com",
            username: "failUser",
            password: "hashedPassword",
            avatar: null,
            name: "Fail"
        };

        mockUserRepository.create.mockRejectedValue(new Error("db error"));

        await expect(useCase.execute(input)).rejects.toThrow("db error");
    });
});
