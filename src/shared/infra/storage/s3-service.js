import {DeleteObjectCommand, PutObjectCommand} from "@aws-sdk/client-s3";
import path from "path";
import sharp from "sharp";
import {v4 as uuidv4} from "uuid";

import {extractMediaUrlsFromHtml} from "../../utils/html-helper.js";
import {s3} from "./s3.js";
import {appConfig} from "../../../config/app-config.js";

const s3Domain = `${appConfig.aws.bucket}.s3.${appConfig.aws.region}.amazonaws.com`;

export const genS3Url = (key) =>
    `https://${s3Domain}/${key}`;

export const uploadToS3 = async (file, folderPath) => {
    let key;
    let processedBuffer = file.buffer;

    if (file.mimetype.startsWith('image/')) {
        processedBuffer = await sharp(file.buffer)
            .resize({width: 1280})
            .webp({quality: 80})
            .toBuffer();

        key = `${folderPath}/${Date.now()}.webp`;
    } else {
        const ext = path.extname(file.originalname);
        key = `${folderPath}/${Date.now()}${ext}`;
    }

    await s3.send(
        new PutObjectCommand({
            Bucket: appConfig.aws.bucket,
            Key: key,
            Body: processedBuffer,
            ContentType: file.mimetype.startsWith('image/') ? 'image/webp' : file.mimetype
        })
    );

    return genS3Url(key);
};

export const uploadMultipleToS3 = async (files, folderPath) => {
    const uploadedUrls = [];

    for (const file of files) {
        const url = await uploadToS3(file, folderPath);
        uploadedUrls.push(url);
    }

    return uploadedUrls;
};

export const uploadBase64Image = async (base64Str, folderPath) => {
    if (!base64Str || !base64Str.startsWith('data:image/')) {
        throw {status: 400, message: 'Invalid base64 image string'};
    }

    const [meta, base64Data] = base64Str.split(',');
    const mimeMatch = meta.match(/data:(image\/[^;]+);base64/);
    if (!mimeMatch) {
        throw {status: 400, message: 'Invalid image mime type'};
    }

    const buffer = Buffer.from(base64Data, 'base64');
    const key = `${folderPath}/${uuidv4()}.webp`;

    const resizedBuffer = await sharp(buffer)
        .resize({width: 1280})
        .webp({quality: 80})
        .toBuffer();

    await s3.send(
        new PutObjectCommand({
            Bucket: appConfig.aws.bucket,
            Key: key,
            Body: resizedBuffer,
            ContentType: 'image/webp',
        })
    );

    return genS3Url(key);
};

export const uploadBase64ImagesInHtml = async (html, folderPath) => {
    const imgRegex = /<img[^>]*src="(data:image\/[^;]+;base64,[^"]+)"[^>]*>/g;
    let match;

    while ((match = imgRegex.exec(html)) !== null) {
        const base64Str = match[1];
        const [meta, base64Data] = base64Str.split(',');
        const mimeMatch = meta.match(/data:(image\/[^;]+);base64/);

        if (!mimeMatch) continue;

        const buffer = Buffer.from(base64Data, 'base64');
        const key = `${folderPath}/${uuidv4()}.webp`;

        const resizedBuffer = await sharp(buffer)
            .resize({width: 1280})
            .webp({quality: 80})
            .toBuffer();

        await s3.send(
            new PutObjectCommand({
                Bucket: appConfig.aws.bucket,
                Key: key,
                Body: resizedBuffer,
                ContentType: 'image/webp',
            })
        );

        const imageUrl = genS3Url(key);
        html = html.replace(base64Str, imageUrl);
    }

    return html;
};

export function extractS3UrlsFromHtmlFields(fields) {
    const urls = fields.flatMap(extractMediaUrlsFromHtml);

    return urls
        .filter(url => url.includes(s3Domain))
        .map(url => decodeURIComponent(url));
}

export async function cleanUpUnusedS3Media(oldContent, newContent) {
    if (!oldContent || !newContent) return;

    const oldUrls = Object.values(oldContent)
        .flatMap(extractMediaUrlsFromHtml)
        .filter(url => url.includes(s3Domain));

    const newContentString = JSON.stringify(newContent);

    const removedUrls = oldUrls.filter(url => !newContentString.includes(url));

    for (const url of removedUrls) {
        const key = decodeURIComponent(url.split('.com/')[1]);
        try {
            await s3.send(new DeleteObjectCommand({
                Bucket: appConfig.aws.bucket,
                Key: key
            }));
            console.log(`Deleted from S3: ${key}`);
        } catch (err) {
            console.log('Lỗi khi xóa ảnh cũ khỏi S3:', err.message);
        }
    }
}

export async function deleteS3ObjectByUrl(url) {
    if (!url.includes(s3Domain)) return false;

    const key = url.split('.amazonaws.com/')[1];
    if (!key) return false;

    try {
        await s3.send(new DeleteObjectCommand({
            Bucket: appConfig.aws.bucket,
            Key: key
        }));
        // console.log(`Đã xóa file S3: ${key}`);
        return true;
    } catch (err) {
        // console.error('Lỗi khi xóa file khỏi S3:', err.message);
        return false;
    }
}


