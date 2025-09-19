import { UserRepositoryImpl } from "../../../src/core/data/repositories/user-repository-impl.js";
import UserModel from "../../../src/core/data/models/user-schema.js";

jest.mock("../../../src/core/data/models/user-schema.js");

describe("UserRepositoryImpl", () => {
    let repository;

    beforeEach(() => {
        repository = new UserRepositoryImpl();
        jest.clearAllMocks();
    });

    describe("getById", () => {
        it("nếu tìm thấy user theo id thì trả về entity", async () => {
            const fakeDoc = {
                _id: "123",
                email: "test@example.com",
                createdAt: new Date("2025-09-18T18:04:26.365Z"),
                lastLogin: new Date("2025-09-18T18:04:26.365Z"),
            };
            UserModel.findById.mockResolvedValue(fakeDoc);

            const result = await repository.getById({ userId: "123" });

            expect(UserModel.findById).toHaveBeenCalledWith("123");
            expect(result).toMatchObject({
                id: "123",
                email: "test@example.com",
            });
        });

        it("nếu lỗi khi gọi database thì ném ra lỗi", async () => {
            UserModel.findById.mockRejectedValue(new Error("DB lỗi"));

            await expect(repository.getById({ userId: "123" })).rejects.toThrow("getUserFailedError");
        });
    });

    describe("getByUsername", () => {
        it("nếu tìm thấy user theo username thì trả về entity", async () => {
            const fakeDoc = {
                _id: "123",
                username: "tester",
                createdAt: new Date("2025-09-18T18:04:26.387Z"),
                lastLogin: new Date("2025-09-18T18:04:26.387Z"),
            };
            UserModel.findOne.mockResolvedValue(fakeDoc);

            const result = await repository.getByUsername({ username: "tester" });

            expect(UserModel.findOne).toHaveBeenCalledWith({ normalizedUsername: "tester" });
            expect(result).toMatchObject({
                id: "123",
                username: "tester",
            });
        });

        it("nếu lỗi khi gọi database thì ném ra lỗi", async () => {
            UserModel.findOne.mockRejectedValue(new Error("DB lỗi"));

            await expect(repository.getByUsername({ username: "tester" })).rejects.toThrow("getUserFailedError");
        });
    });

    describe("getByEmail", () => {
        it("nếu tìm thấy user theo email thì trả về entity", async () => {
            const fakeDoc = {
                _id: "123",
                email: "test@example.com",
                createdAt: new Date("2025-09-18T18:04:26.394Z"),
                lastLogin: new Date("2025-09-18T18:04:26.394Z"),
            };
            UserModel.findOne.mockResolvedValue(fakeDoc);

            const result = await repository.getByEmail({ email: "test@example.com" });

            expect(UserModel.findOne).toHaveBeenCalledWith({ normalizedEmail: "test@example.com" });
            expect(result).toMatchObject({
                id: "123",
                email: "test@example.com",
            });
        });

        it("nếu lỗi khi gọi database thì ném ra lỗi", async () => {
            UserModel.findOne.mockRejectedValue(new Error("DB lỗi"));

            await expect(repository.getByEmail({ email: "test@example.com" })).rejects.toThrow("getUserFailedError");
        });
    });

    describe("create", () => {
        it("nếu tạo user thành công thì trả về entity", async () => {
            const fakeUserEntity = { email: "test@example.com" };
            const fakeSavedDoc = { _id: "123", email: "test@example.com" };
            UserModel.mockImplementation(() => ({ save: jest.fn().mockResolvedValue(fakeSavedDoc) }));

            const result = await repository.create({ userEntity: fakeUserEntity });

            expect(result).toMatchObject({
                id: "123",
                email: "test@example.com",
            });
        });

        it("nếu lỗi khi lưu user thì ném ra lỗi", async () => {
            const fakeUserEntity = { email: "fail@example.com" };
            UserModel.mockImplementation(() => ({ save: jest.fn().mockRejectedValue(new Error("DB lỗi")) }));

            await expect(repository.create({ userEntity: fakeUserEntity })).rejects.toThrow("createUserFailedError");
        });
    });

    describe("update", () => {
        it("nếu cập nhật thành công thì trả về entity mới", async () => {
            const fakeUserEntity = { id: "123", email: "updated@example.com" };
            const fakeUpdatedDoc = { _id: "123", email: "updated@example.com" };
            UserModel.findByIdAndUpdate.mockResolvedValue(fakeUpdatedDoc);

            const result = await repository.update({ userEntity: fakeUserEntity });

            expect(UserModel.findByIdAndUpdate).toHaveBeenCalledWith(
                "123",
                { $set: expect.any(Object) },
                { new: true }
            );
            expect(result).toMatchObject({
                id: "123",
                email: "updated@example.com",
            });
        });

        it("nếu không tìm thấy document để update thì ném lỗi", async () => {
            const fakeUserEntity = { id: "123", email: "updated@example.com" };
            UserModel.findByIdAndUpdate.mockResolvedValue(null);

            await expect(repository.update({ userEntity: fakeUserEntity })).rejects.toThrow("updateUserFailedError");
        });

        it("nếu database bị lỗi thì ném lỗi", async () => {
            const fakeUserEntity = { id: "123", email: "fail@example.com" };
            UserModel.findByIdAndUpdate.mockRejectedValue(new Error("DB lỗi"));

            await expect(repository.update({ userEntity: fakeUserEntity })).rejects.toThrow("updateUserFailedError");
        });
    });
});
