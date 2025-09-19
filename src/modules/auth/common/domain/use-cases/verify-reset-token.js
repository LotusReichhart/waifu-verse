export class VerifyResetTokenUseCase {
    constructor(tokenService) {
        this.tokenService = tokenService;
    }

    async execute(token) {
        return await this.tokenService.verifyResetToken(token);
    }
}