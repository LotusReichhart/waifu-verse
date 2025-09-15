export const extractMediaUrlsFromHtml = (html) => {
    if (!html || typeof html !== 'string') return [];

    const urls = [];

    const imgRegex = /<img[^>]+src="([^">]+)"/g;
    let match;
    while ((match = imgRegex.exec(html)) !== null) {
        urls.push(match[1]);
    }

    const videoRegex = /<video[^>]+src="([^">]+)"/g;
    while ((match = videoRegex.exec(html)) !== null) {
        urls.push(match[1]);
    }

    return urls;
}
