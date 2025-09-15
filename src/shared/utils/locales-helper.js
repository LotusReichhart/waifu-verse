import path from "path";
import fs from "fs";

const rootDir = path.resolve(process.cwd(), "src");

export function loadLocale(lang, ...segments) {
    try {
        const filePath = path.join(rootDir, "locales", lang, ...segments) + (segments.at(-1).endsWith(".json") ? "" : ".json");
        return JSON.parse(fs.readFileSync(filePath, "utf8"));
    } catch (err) {
        try {
            const filePath = path.join(rootDir, "locales", "en", ...segments) + (segments.at(-1).endsWith(".json") ? "" : ".json");
            return JSON.parse(fs.readFileSync(filePath, "utf8"));
        } catch {
            return {};
        }
    }
}
