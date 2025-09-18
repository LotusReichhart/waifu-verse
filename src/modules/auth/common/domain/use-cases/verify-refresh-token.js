export class VerifyRefreshTokenUseCase {
    constructor(tokenService) {
        this.tokenService = tokenService;
    }

    async execute(token) {
        return await this.tokenService.verifyRefreshToken(token);
    }
}