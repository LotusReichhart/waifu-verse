import {
    RequestAccountRegistrationUseCase,
    VerifyAccountRegistration
} from "./register/domain/use-cases/index.js";
import {
    CreateNewUserUseCase, DeleteRefreshTokenUseCase,
    DeleteResetTokenUseCase,
    FindUserByEmailUseCase,
    IssueTokensUseCase,
    SaveResetTokenUseCase,
    VerifyRefreshTokenUseCase,
    VerifyResetTokenUseCase
} from "./common/domain/use-cases/index.js";
import {LoginWithUsernameOrEmailUseCase} from "./login/domain/use-cases/index.js";
import {
    RequestForgotPasswordUseCase,
    VerifyForgotPasswordUseCase
} from "./forgot-password/domain/use-cases/index.js";

import {LoginWithGoogleUseCase} from "./google/domain/use-cases/index.js";
import {RefreshAuthUseCase} from "./refresh/domain/use-cases/index.js";

export function createAuthUseCases({userRepository, otpService, mailerService, tokenService}) {
    return {
        loginWithUsernameOrEmail: new LoginWithUsernameOrEmailUseCase(
            userRepository,
        ),

        loginWithGoogle: new LoginWithGoogleUseCase(
            userRepository
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

        refreshAuth: new RefreshAuthUseCase(
            userRepository
        ),

        findUserByEmail: new FindUserByEmailUseCase(userRepository),
        createNewUser: new CreateNewUserUseCase(userRepository),
        issueTokens: new IssueTokensUseCase(tokenService),
        saveResetToken: new SaveResetTokenUseCase(tokenService),
        verifyResetToken: new VerifyResetTokenUseCase(tokenService),
        deleteRefreshToken: new DeleteRefreshTokenUseCase(tokenService),
        deleteResetToken: new DeleteResetTokenUseCase(tokenService),
        verifyRefreshToken: new VerifyRefreshTokenUseCase(tokenService)
    };
}
