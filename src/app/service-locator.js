import {UserRepositoryImpl} from "../core/data/repositories/user-repository-impl.js";
import {RedisOTPService} from "../shared/infra/cache/redis-otp-service.js";
import {RedisTokenService} from "../shared/infra/cache/redis-token-service.js";
import {MailerServiceImpl} from "../shared/infra/transport/mailer-service-impl.js";

import {createAuthUseCases} from "../modules/auth/auth-use-cases.js";
import {createUserUseCases} from "../modules/user/user-use-cases.js";
import {createApiUseCases} from "../modules/api/api-use-cases.js";

class ServiceLocator {
    constructor() {
        // --- Core services ---
        this.userRepository = new UserRepositoryImpl();
        this.otpService = new RedisOTPService();
        this.mailerService = new MailerServiceImpl();
        this.tokenService = new RedisTokenService();

        // --- Auth use-cases ---
        this.auth = createAuthUseCases({
            userRepository: this.userRepository,
            otpService: this.otpService,
            mailerService: this.mailerService,
            tokenService: this.tokenService
        });

        this.user = createUserUseCases({
            userRepository: this.userRepository
        })

        // --- Api use-cases ---
        this.api = createApiUseCases({
            otpService: this.otpService,
            mailerService: this.mailerService,
            userRepository: this.userRepository
        })
    }
}

// Singleton instance
export const serviceLocator = new ServiceLocator();
