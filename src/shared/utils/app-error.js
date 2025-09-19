export class AppError extends Error {
    constructor({ key = "global", code = "unknownError", status = 500 }) {
        super(code);
        this.name = "AppError";
        this.key = key;
        this.code = code;
        this.status = status;
    }
}
