export class IssueTokensUseCase {
    constructor(tokenService) {
        this.tokenService = tokenService;
    }

    async execute(user) {
        return await this.tokenService.issueTokens(user);
    }
}