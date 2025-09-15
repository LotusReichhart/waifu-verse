import argon2 from "argon2";
import {hashToken} from "../../utils/token-helper.js";
import redisClient from "./redis.js";

export async function storeRefreshToken(userId, token, ttlSeconds = 60 * 60 * 24 * 30) {
    try {
        const hashed = hashToken(token);
        await redisClient.set(`refresh:${hashed}`, userId, {EX: ttlSeconds});
    } catch (err) {
        console.log("storeRefreshToken err:", err.message);
        return null;
    }
}

export async function verifyRefreshToken(token) {
    try {
        const hashed = hashToken(token);
        return await redisClient.get(`refresh:${hashed}`);
    } catch (err) {
        console.log("verifyRefreshToken err:", err.message);
        return null;
    }
}

export async function deleteRefreshToken(token) {
    const hashed = hashToken(token);
    await redisClient.del(`refresh:${hashed}`);
}

export async function trackView(characterId, ip) {
    const key = `char:${characterId}:viewed:${ip}`;

    const exists = await redisClient.exists(key);
    if (exists) return false;

    await redisClient.set(key, "1", {EX: 900});
    return true;
}

export async function canHeart(userId) {
    const key = `user:${userId}:heart:lock`;

    const exists = await redisClient.exists(key);
    if (exists) return false;

    await redisClient.set(key, "1", {EX: 5});
    return true;
}

export async function getOTPRequestLimit({email, max = 3}) {
    // await deleteOTPRequestLimit(email)

    const countKey = `otp:count:${email}`;
    const count = parseInt(await redisClient.get(countKey) || "0", 10);

    return {allowed: count < max, count};
}

export async function saveOTPtoRedis({
                                         email,
                                         otp,
                                         otp_ttl = 600,
                                         limit_ttl = 900,
                                         max = 3,
                                         username,
                                         password
                                     }) {
    try {
        const key = `otp:${email}`;
        const countKey = `otp:count:${email}`;

        const payload = {otp};
        if (username && password) {
            payload.email = email;
            payload.username = username;
            payload.password = await argon2.hash(password);
        }

        await redisClient.set(key, JSON.stringify(payload), {EX: otp_ttl});

        const {count} = await getOTPRequestLimit({email, max});

        if (count === 0) {
            await redisClient.set(countKey, 1, {EX: limit_ttl});
        } else {
            const ttl = await redisClient.ttl(countKey);
            await redisClient.incr(countKey);
            if (ttl === -1) {
                await redisClient.expire(countKey, limit_ttl);
            }
        }
    } catch (err) {
        console.log("saveOTPtoRedis error:", err);
    }
}

export async function updateOTPOnly({email, otp, ttl = 600, limit_ttl = 900, max = 3}) {
    const key = `otp:${email}`;
    const countKey = `otp:count:${email}`;
    const existing = await redisClient.get(key);

    if (!existing) {
        return {success: false, data: false};
    }

    let data;
    try {
        data = JSON.parse(existing);
    } catch {
        return {success: false, data: false};
    }

    if (!data.email || !data.username || !data.password) {
        return {success: true, data: false};
    }

    data.otp = otp;

    await redisClient.set(key, JSON.stringify(data), {EX: ttl});

    const {count} = await getOTPRequestLimit({email, max});
    if (count === 0) {
        await redisClient.set(countKey, 1, {EX: limit_ttl});
    } else {
        const ttlCount = await redisClient.ttl(countKey);
        await redisClient.incr(countKey);
        if (ttlCount === -1) {
            await redisClient.expire(countKey, limit_ttl);
        }
    }

    return {success: true, data: true};
}

export async function getOTP(email) {
    const key = `otp:${email}`;
    const json = await redisClient.get(key);
    if (!json) return null;

    try {
        return JSON.parse(json);
    } catch (err) {
        console.log("Invalid OTP data in Redis:", err);
        return null;
    }
}

export async function deleteOTP(email) {
    try {
        const key = `otp:${email}`;
        await redisClient.del(key);
    } catch (err) {
        console.log("deleteOTP err: ", err);
        return null;
    }
}

export async function validateAndConsumeOTP({otp, email}) {
    try {
        const storedOtp = await getOTP(email);

        if (!storedOtp) {
            return {success: false};
        }

        const otpValue = storedOtp.otp;
        if (otpValue !== otp) {
            return {success: false};
        }

        await Promise.allSettled([
            deleteOTP(email),
            deleteOTPRequestLimit(email)
        ]);

        if (storedOtp.email && storedOtp.username && storedOtp.password) {
            return {success: true, data: storedOtp};
        }

        return {success: true};
    } catch (err) {
        console.log("validateAndConsumeOTP error:", err);
        return {success: false};
    }
}

export async function deleteOTPRequestLimit(email) {
    const countKey = `otp:count:${email}`;
    await redisClient.del(countKey);
}

export async function saveResetToken(email, token, ttl = 15 * 60) {
    try {
        const hashed = hashToken(token);
        const key = `resetToken:${hashed}`;
        await redisClient.set(key, email, {EX: ttl});
        return {success: true};
    } catch (err) {
        console.log("saveResetToken error:", err);
        return {success: false};
    }
}

export async function verifyResetToken(token) {
    if (!token) return {email: null};
    try {
        const hashed = hashToken(token);
        const key = `resetToken:${hashed}`;
        return {email: await redisClient.get(key)};
    } catch (err) {
        console.log("verifyResetToken error:", err);
        return {email: null};
    }
}

export async function deleteResetToken(token) {
    try {
        const hashed = hashToken(token);
        const key = `resetToken:${hashed}`;
        await redisClient.del(key);
    } catch (err) {
        console.log("deleteResetToken error:", err);
    }
}