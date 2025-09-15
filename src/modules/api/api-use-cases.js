import {ResendOTPUseCase} from "./auth/domain/use-cases/index.js";

export function createApiUseCases({otpService, mailerService}){
    return{
        resendOtp: new ResendOTPUseCase(otpService, mailerService),
    }
}