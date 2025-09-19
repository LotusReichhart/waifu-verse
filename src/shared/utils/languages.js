export const LANGUAGE = {
    EN: 'en',
    VI: 'vi',
    JA: 'ja',
};

export const LANGUAGE_LIST = [
    { code: LANGUAGE.EN, title: 'English', flag: '🇺🇸' },
    { code: LANGUAGE.VI, title: 'Tiếng Việt', flag: '🇻🇳' },
    { code: LANGUAGE.JA, title: '日本語', flag: '🇯🇵' },
];

export const LANGUAGE_CODES = LANGUAGE_LIST.map(lang => lang.code);

export const LANGUAGE_MAP = LANGUAGE_LIST.reduce((acc, lang) => {
    acc[lang.code] = { title: lang.title, flag: lang.flag };
    return acc;
}, {});
