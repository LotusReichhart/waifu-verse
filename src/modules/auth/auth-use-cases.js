import {
    RequestAccountRegistrationUseCase, VerifyAccountRegistration
} from "./register/domain/use-cases/index.js";
import {
    CreateNewUserUseCase,
    FindUserByEmailUseCase,
    IssueTokensUseCase
} from "./common/domain/use-cases/index.js";

// sau này import thêm login, forgot-password use-cases ở đây

export function createAuthUseCases({userRepository, otpService, mailerService, tokenService}) {
    return {
        requestAccountRegistration: new RequestAccountRegistrationUseCase(
            userRepository,
            otpService,
            mailerService
        ),
        verifyAccountRegistration: new VerifyAccountRegistration(
            userRepository,
            otpService
        ),

        findUserByEmail: new FindUserByEmailUseCase(userRepository),
        createNewUser: new CreateNewUserUseCase(userRepository),
        issueTokens: new IssueTokensUseCase(tokenService),
        // sau này thêm loginUseCase, forgotPasswordUseCase, ...
    };
}
