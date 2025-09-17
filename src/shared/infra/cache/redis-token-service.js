import {TokenService} from "../../../modules/auth/services/token-service.js";
import {
    removeResetTokenFromRedis,
    storeRefreshToken,
    storeResetToken,
    validateAndConsumeResetToken
} from "./redis-service.js";
import {createAccessToken, createRefreshToken, createResetToken} from "../../utils/token-helper.js";

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

    async saveResetToken({email}) {
        const resetToken = createResetToken();
        const {success} = await storeResetToken({email: email, token: resetToken});
        return {resetToken: success ? resetToken : null};
    }

    async verifyResetToken(token) {
        const {email} = await validateAndConsumeResetToken(token);
        return {email: email};
    }

    async deleteResetToken(token) {
        await removeResetTokenFromRedis(token);
    }
}