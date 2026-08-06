export const ENTITY_GROUP_LOTUS = 'LOTUS_QB';
export const ENTITY_GROUP_POSTRAL = 'POSTRAL';
export const ENTITY_NAME_QUESTION_BOOK = 'QUESTION_BOOK';
export const ENTITY_NAME_POSTRAL_ACCOUNT = 'ACCOUNT';
export const ENTITY_NAME_POSTRAL_ADDRESS = 'ADDRESS';
export const ENTITY_NAME_POSTRAL_TAX = 'TAX';
export const ENTITY_NAME_POSTRAL_ITEM = 'ITEM';
export const ENTITY_NAME_QUESTION = 'QUESTION';
export const ENTITY_NAME_LECTURE = 'LECTURE';
export const LOTUS_MOD_CAP = 'LOTUS_MODERATOR';

export enum LotusCapability {
    LIBRARY = 101,
    TENANT = 102,
}

/**
 * Shared LIBRARY/TENANT exclusivity rule for the LOTUS_QB/QUESTION_BOOK capability
 * selector, reused by every route that offers this custom capability selection.
 */
export function lotusContentCustomCapabilitySelection(newCapabilities: number[], oldValue: number[]): number[] | undefined {
    if (newCapabilities.includes(LotusCapability.LIBRARY) && !oldValue.includes(LotusCapability.LIBRARY)) {
        return [LotusCapability.LIBRARY];
    }
    if (newCapabilities.includes(LotusCapability.TENANT) && !oldValue.includes(LotusCapability.TENANT)) {
        return [LotusCapability.TENANT];
    }
    return undefined;
}