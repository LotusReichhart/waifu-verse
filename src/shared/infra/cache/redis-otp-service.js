import {OTPService} from "../../../modules/auth/services/otp-service.js";
import {getOTPRequestLimit, saveOTPtoRedis, updateOTPOnly, validateAndConsumeOTP} from "./redis-service.js";

export class RedisOTPService extends OTPService {
    async checkLimit(email) {
        return getOTPRequestLimit({email});
    }

    async saveOTP({email, otp, username, password}) {
        return saveOTPtoRedis({email, otp, username, password});
    }

    async verifyOTP({otp, email}) {
        return validateAndConsumeOTP({otp: otp, email: email});
    }

    async updateOTP({otp, email}) {
        const {success, data} = await updateOTPOnly({email: email, otp: otp});
        return {success, data};
    }
}
