import {ChangePasswordUseCase, ResendOTPUseCase} from "./auth/domain/use-cases/index.js";

export function createApiUseCases({otpService, mailerService, userRepository}) {
    return {
        resendOtp: new ResendOTPUseCase(otpService, mailerService),

        changePassword: new ChangePasswordUseCase(userRepository),
    }
}