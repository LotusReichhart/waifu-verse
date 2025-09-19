import jwt from "jsonwebtoken";
import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET;

export function createAccessToken(user) {
    return jwt.sign({
        id: user.id,
        email: user.email,
        roles: user.roles,
    }, JWT_SECRET, {expiresIn: '1h'});
}

export function verifyAccessToken(token) {
    return jwt.verify(token, JWT_SECRET);
}

export function createRefreshToken() {
    return crypto.randomBytes(40).toString('hex');
}

export function createResetToken() {
    return crypto.randomBytes(32).toString('hex');
}

export function hashToken(token) {
    return crypto.createHash("sha256").update(token).digest("hex");
}
