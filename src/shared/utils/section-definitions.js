export const sectionDefinitions = {
    overview: {
        summary: "rich-text",
        appearance: "rich-text",
        personality: "rich-text",
        abilities: "rich-text",
    },
    mediaPreview: {
        mediaType: ["image"],
        caption: "string"
    },
    basicInformation: {
        nickname: "string",
        age: "string",
        dateOfBirth: "string",
        placeOfBirth: "string",
        profession: "string",
        lifeStatus: ["alive", "deceased", "unknown"],
    },
    physicalAttributes: {
        height: "string",
        weight: "string",
        hairColor: "string",
        eyeColor: "string",
        skinColor: "string",
        dominantHand: "string",
        bloodType: "string",
        healthCondition: "string",
        specialAbilities: "string",
    },
    psychology: {
        likes: "string",
        hobbies: "string",
        dislikes: "string",
        dreams: "string",
        greatestFear: "string",
    },
    history: {
        biography:"rich-text",
        role:"rich-text",
        relationships: "rich-text",
        keyMoments: "rich-text",
    },
    gallery: {
        mediaType: ["image"],
        caption: "string"
    },
    other: {
        trivia: "rich-text",
        quotes: "rich-text",
        references:"rich-text",
    }
};

export const getValidSections = () => Object.keys(sectionDefinitions);

export const SECTION_KEYS = Object.keys(sectionDefinitions).reduce((acc, key) => {
    acc[key.toUpperCase()] = key;
    return acc;
}, {});

export const SECTION_GROUPS = {
    profile: [
        'basicInformation',
        'physicalAttributes',
        'personality'
    ],
    articleBody: [
        'overview',
        'history',
        'other'
    ],
    assets: [
        'mediaPreview',
        'gallery'
    ]
};

export function getGroupFromSection(section) {
    for (const [group, sections] of Object.entries(SECTION_GROUPS)) {
        if (sections.includes(section)) return group;
    }
    return null;
}
