// Escapes regex special characters so user-supplied text can be used safely inside a RegExp
export const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
