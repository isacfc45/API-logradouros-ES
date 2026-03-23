"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeString = normalizeString;
const unidecode_1 = __importDefault(require("unidecode"));
function normalizeString(str) {
    if (!str)
        return '';
    const normalized = (0, unidecode_1.default)(str)
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, ' ');
    return normalized;
}
