import { CharacterRepositoryImpl } from "../../../src/core/data/repositories/character-repository-impl.js";
import CharacterModel from "../../../src/core/data/models/character-schema.js";
import { toEntity } from "../../../src/core/data/mappers/character-mapper.js";
import {CHARACTER_STATUS} from "../../../src/shared/utils/schema-status.js";

jest.mock("../../../src/core/data/models/character-schema.js");

describe("CharacterRepositoryImpl", () => {
    let repository;

    beforeEach(() => {
        repository = new CharacterRepositoryImpl();
        jest.clearAllMocks();
    });

    describe("getListCharacters", () => {
        it("nếu có filter, sort và pagination thì trả về total và items", async () => {
            const fakeItems = [{ _id: "1", name: "Char1" }, { _id: "2", name: "Char2" }];
            CharacterModel.countDocuments.mockResolvedValue(2);
            CharacterModel.find.mockReturnValue({
                select: jest.fn().mockReturnThis(),
                sort: jest.fn().mockReturnThis(),
                skip: jest.fn().mockReturnThis(),
                limit: jest.fn().mockReturnThis(),
                lean: jest.fn().mockResolvedValue(fakeItems),
            });

            const result = await repository.getListCharacters({
                q: "Char",
                genders: ["male"],
                sort: "name-asc",
                page: 1,
                limit: 10
            });

            expect(CharacterModel.countDocuments).toHaveBeenCalledWith({
                status: CHARACTER_STATUS.ENABLE,
                normalizedName: { $regex: "Char", $options: "i" },
                gender: { $in: ["male"] }
            });
            expect(result).toEqual({ total: 2, items: fakeItems });
        });
    });

    describe("getById", () => {
        it("nếu tìm thấy character theo id thì trả về entity", async () => {
            const fakeDoc = { _id: "123", name: "Char1" };
            CharacterModel.findById.mockResolvedValue(fakeDoc);

            const result = await repository.getById({ characterId: "123" });

            expect(CharacterModel.findById).toHaveBeenCalledWith("123");
            expect(result).toEqual(toEntity(fakeDoc));
        });

        it("nếu lỗi khi gọi database thì ném ra lỗi", async () => {
            CharacterModel.findById.mockRejectedValue(new Error("DB lỗi"));

            await expect(repository.getById({ characterId: "123" }))
                .rejects.toThrow("getCharacterFailedError");
        });
    });

    describe("getBySlug", () => {
        it("nếu tìm thấy character theo slug thì trả về entity", async () => {
            const fakeDoc = { _id: "123", slug: "char1" };
            CharacterModel.findOne.mockResolvedValue(fakeDoc);

            const result = await repository.getBySlug({ slug: "char1" });

            expect(CharacterModel.findOne).toHaveBeenCalledWith({ slug: "char1" });
            expect(result).toEqual(toEntity(fakeDoc));
        });

        it("nếu lỗi khi gọi database thì ném ra lỗi", async () => {
            CharacterModel.findOne.mockRejectedValue(new Error("DB lỗi"));

            await expect(repository.getBySlug({ slug: "char1" }))
                .rejects.toThrow("getCharacterFailedError");
        });
    });

    describe("create", () => {
        it("nếu tạo character thành công thì trả về entity", async () => {
            const fakeEntity = { name: "Char1" };
            const fakeSavedDoc = { _id: "123", name: "Char1" };
            CharacterModel.mockImplementation(() => ({ save: jest.fn().mockResolvedValue(fakeSavedDoc) }));

            const result = await repository.create({ characterEntity: fakeEntity });

            expect(result).toEqual(toEntity(fakeSavedDoc));
        });

        it("nếu lỗi khi lưu character thì ném ra lỗi", async () => {
            const fakeEntity = { name: "Char1" };
            CharacterModel.mockImplementation(() => ({ save: jest.fn().mockRejectedValue(new Error("DB lỗi")) }));

            await expect(repository.create({ characterEntity: fakeEntity }))
                .rejects.toThrow("createCharacterFailedError");
        });
    });

    describe("update", () => {
        it("nếu cập nhật thành công thì trả về entity mới", async () => {
            const fakeEntity = { id: "123", name: "UpdatedChar" };
            const fakeUpdatedDoc = { _id: "123", name: "UpdatedChar" };
            CharacterModel.findByIdAndUpdate.mockResolvedValue(fakeUpdatedDoc);

            const result = await repository.update({ characterEntity: fakeEntity });

            expect(CharacterModel.findByIdAndUpdate).toHaveBeenCalledWith(
                "123",
                { $set: expect.any(Object) },
                { new: true }
            );
            expect(result).toEqual(toEntity(fakeUpdatedDoc));
        });

        it("nếu không tìm thấy document để update thì ném lỗi", async () => {
            const fakeEntity = { id: "123", name: "UpdatedChar" };
            CharacterModel.findByIdAndUpdate.mockResolvedValue(null);

            await expect(repository.update({ characterEntity: fakeEntity }))
                .rejects.toThrow("updateCharacterFailedError");
        });

        it("nếu database bị lỗi thì ném lỗi", async () => {
            const fakeEntity = { id: "123", name: "UpdatedChar" };
            CharacterModel.findByIdAndUpdate.mockRejectedValue(new Error("DB lỗi"));

            await expect(repository.update({ characterEntity: fakeEntity }))
                .rejects.toThrow("updateCharacterFailedError");
        });
    });
});
