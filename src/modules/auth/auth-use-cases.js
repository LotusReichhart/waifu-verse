import {
    RequestAccountRegistrationUseCase, VerifyAccountRegistration
} from "./register/domain/use-cases/index.js";
import {
    CreateNewUserUseCase,
    FindUserByEmailUseCase,
    IssueTokensUseCase
} from "./common/domain/use-cases/index.js";
import {LoginWithUsernameOrEmailUseCase} from "./login/domain/use-cases/index.js";
import {RequestForgotPasswordUseCase, VerifyForgotPasswordUseCase} from "./forgot-password/domain/use-cases/index.js";
import {SaveRefreshTokenUseCase} from "./common/domain/use-cases/save-reset-token.js";
import {VerifyResetTokenUseCase} from "./common/domain/use-cases/verify-reset-token.js";
import {DeleteResetTokenUseCase} from "./common/domain/use-cases/delete-reset-token.js";

export function createAuthUseCases({userRepository, otpService, mailerService, tokenService}) {
    return {
        loginWithUsernameOrEmail: new LoginWithUsernameOrEmailUseCase(
            userRepository,
        ),

        requestAccountRegistration: new RequestAccountRegistrationUseCase(
            userRepository,
            otpService,
            mailerService
        ),
        verifyAccountRegistration: new VerifyAccountRegistration(
            userRepository,
            otpService
        ),

        requestForgotPassword: new RequestForgotPasswordUseCase(
            userRepository,
            otpService,
            mailerService
        ),
        verifyForgotPassword: new VerifyForgotPasswordUseCase(
            otpService
        ),

        findUserByEmail: new FindUserByEmailUseCase(userRepository),
        createNewUser: new CreateNewUserUseCase(userRepository),
        issueTokens: new IssueTokensUseCase(tokenService),
        saveResetToken: new SaveRefreshTokenUseCase(tokenService),
        verifyResetToken: new VerifyResetTokenUseCase(tokenService),
        deleteResetToken: new DeleteResetTokenUseCase(tokenService),
    };
}
