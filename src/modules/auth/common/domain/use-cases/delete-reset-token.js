export class DeleteResetTokenUseCase {
    constructor(tokenService) {
        this.tokenService = tokenService;
    }

    async execute(token) {
        await this.tokenService.deleteResetToken(token);
    }
}