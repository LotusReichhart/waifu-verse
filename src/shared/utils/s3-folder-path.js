export const userAvatarFolderPath = (id) => {
    return `users/${id}/avatar`;
}

export const characterAvatarFolderPath = (id) => {
    return `characters/${id}/avatar`;
}

export const characterEntryFolderPath = (id,section,language) => {
    return `characters/${id}/entries/${section}/${language}`;
}