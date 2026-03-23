import unidecode from 'unidecode';
export function normalizeString(str) {
    if (!str)
        return '';
    const normalized = unidecode(str)
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, ' ');
    return normalized;
}
//# sourceMappingURL=normalization.js.map