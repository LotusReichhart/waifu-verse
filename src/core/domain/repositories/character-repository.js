export class CharacterRepository {
    /**
     * Lấy danh sách character với search/filter/sort và phân trang
     * @param {Object} params
     * @param {string} params.q - từ khóa search theo name
     * @param {string[]} params.genders - lọc theo giới tính
     * @param {string} params.sort - kiểu sắp xếp: name-asc, name-desc, createdAt-asc, createdAt-desc
     * @param {number} params.page - số trang
     * @param {number} params.limit - số item mỗi trang
     * @returns {Object} { total, items }
     */
    async getListCharacters({q = '', genders = [], sort = '', page, limit}) {
        throw new Error('Not implemented');
    }

    async getById({characterId}) {
        throw new Error('Not implemented');
    }

    async getBySlug({slug}) {
        throw new Error('Not implemented');
    }

    async create({characterEntity}) {
        throw new Error('Not implemented');
    }

    async update({characterEntity}) {
        throw new Error('Not implemented');
    }
}