export class DeleteRefreshTokenUseCase {
    constructor(tokenService) {
        this.tokenService = tokenService;
    }

    async execute(token) {
        await this.tokenService.deleteRefreshToken(token);
    }
}