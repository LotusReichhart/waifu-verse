export class SaveRefreshTokenUseCase {
    constructor(tokenService) {
        this.tokenService = tokenService;
    }

    async execute({email}) {
        return await this.tokenService.saveResetToken({email: email});
    }
}