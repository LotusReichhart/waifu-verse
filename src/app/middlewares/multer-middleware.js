import multer from "multer";
export const upload = multer({
    storage: multer.memoryStorage() ,
    limits: {
        fieldSize: 10 * 1024 * 1024,
        fileSize: 20 * 1024 * 1024,
    }
});
