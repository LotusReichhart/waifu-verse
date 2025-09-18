import {createAccessToken} from "../../../../../shared/utils/token-helper.js";

export class RefreshAuthUseCase {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async execute({userId}) {
        if (!userId) return {accessToken: null};

        const user = await this.userRepository.getById({userId: userId});
        if (!user) return {accessToken: null};

        const accessToken = createAccessToken(user);
        return {accessToken: accessToken};
    }
}