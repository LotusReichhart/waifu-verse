export function getClientIp(req, res, next) {
    let ip =
        req.headers['cf-connecting-ip'] ||
        req.headers['x-forwarded-for']?.split(',')[0].trim() ||
        req.socket?.remoteAddress ||
        req.ip;

    if (ip?.startsWith("::ffff:")) {
        ip = ip.replace("::ffff:", "");
    }

    req.clientIp = ip;
    next();
}
