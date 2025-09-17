export class TokenService {
    async issueTokens(user) {
        throw new Error("Not implemented");
    }

    async saveRefreshToken({userId, token}) {
        throw new Error("Not implemented");
    }

    async saveResetToken({email}) {
        throw new Error("Not implemented");
    }

    async verifyResetToken(token) {
        throw new Error("Not implemented");
    }

    async deleteResetToken(token) {
        throw new Error("Not implemented");
    }
}