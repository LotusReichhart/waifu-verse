import {TokenService} from "../../../modules/auth/services/token-service.js";
import {storeRefreshToken} from "./redis-service.js";
import {createAccessToken, createRefreshToken} from "../../utils/token-helper.js";

export class RedisTokenService extends TokenService {
    async issueTokens(user) {
        const accessToken = createAccessToken(user);
        const refreshToken = createRefreshToken();

        await this.saveRefreshToken({userId: user.id, token: refreshToken});

        return {accessToken: accessToken, refreshToken: refreshToken};
    }

    async saveRefreshToken({userId, token}) {
        return storeRefreshToken({userId, token});
    }
}