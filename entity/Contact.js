// Constants
import {
    ID,
    OWNER,
    BIRTH_TIME,
    BIRTH_HEIGHT,
    LAST_HEIGHT,
    ACTIVE,
    ALG,
    CIPHER
} from '../constants/fieldNames.js';
import {
    DEFAULT_ID_LENGTH,
    DEFAULT_TIME_LENGTH,
    DEFAULT_BOOLEAN_LENGTH
} from '../constants/constants.js';

class Contact {
    constructor() {
        this.id = null;
        this.alg = null;
        this.cipher = null;
        this.owner = null;
        this.birthTime = null;
        this.birthHeight = null;
        this.lastHeight = null;
        this.active = null;
    }

    static getFieldWidthMap() {
        return {
            [ID]: DEFAULT_ID_LENGTH,
            [OWNER]: DEFAULT_ID_LENGTH,
            [CIPHER]: DEFAULT_ID_LENGTH,
            [BIRTH_TIME]: DEFAULT_TIME_LENGTH,
            [LAST_HEIGHT]: DEFAULT_BOOLEAN_LENGTH
        };
    }

    static getTimestampFieldList() {
        return [BIRTH_TIME];
    }

    static getSatoshiFieldList() {
        return [];
    }

    static getHeightToTimeFieldMap() {
        return {
            [BIRTH_HEIGHT]: BIRTH_TIME
        };
    }

    static getShowFieldNameAsMap() {
        const currentLang = window.currentLanguage || 'en';
        const fieldNames = window.strings?.[currentLang]?.fieldNames || {};
        
        return {
            [ID]: fieldNames.id || 'ID',
            [OWNER]: fieldNames.owner || 'Owner',
            [BIRTH_TIME]: fieldNames.birthTime || 'Birth Time',
            [LAST_HEIGHT]: fieldNames.lastHeight || 'Last Height',
            [ACTIVE]: fieldNames.active || 'Active',
            [ALG]: fieldNames.alg || 'Algorithm',
            [CIPHER]: fieldNames.cipher || 'Cipher'
        };
    }

    static getReplaceWithMeFieldList() {
        return [OWNER];
    }

    static getInputFieldDefaultValueMap() {
        return {};
    }

    static getShowQrCodeFieldList() {
        return [CIPHER];
    }

    toJson() {
        return JSON.stringify(this);
    }

    static fromJson(json) {
        return Object.assign(new Contact(), JSON.parse(json));
    }
}

export default Contact; 