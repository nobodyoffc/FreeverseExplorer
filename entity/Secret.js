
// Constants
import {
    BIRTH_TIME,
    OWNER,
    ID,
    ALG,
    CIPHER,
    ACTIVE,
    LAST_TIME,
    LAST_HEIGHT,
    BIRTH_HEIGHT
} from '../constants/fieldNames.js';
import {
    DEFAULT_ID_LENGTH,
    DEFAULT_TIME_LENGTH,
    DEFAULT_BOOLEAN_LENGTH
} from '../constants/constants.js';

class Secret {
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
            [OWNER]: DEFAULT_ID_LENGTH,
            [ID]: DEFAULT_ID_LENGTH,
            [CIPHER]: DEFAULT_ID_LENGTH,
            [LAST_HEIGHT]: DEFAULT_BOOLEAN_LENGTH,
            [BIRTH_TIME]: DEFAULT_TIME_LENGTH,
        };
    }

    static getTimestampFieldList() {
        return [BIRTH_TIME, LAST_TIME];
    }

    static getSatoshiFieldList() {
        return [];
    }

    static getHeightToTimeFieldMap() {
        return {
            [BIRTH_HEIGHT]: BIRTH_TIME,
            [LAST_HEIGHT]: LAST_TIME
        };
    }

    static getShowFieldNameAsMap() {
        const currentLang = window.currentLanguage || 'en';
        const fieldNames = window.strings?.[currentLang]?.fieldNames || {};
        
        return {
            [ID]: fieldNames.id || 'ID',
            [OWNER]: fieldNames.owner || 'Owner',
            [ALG]: fieldNames.alg || 'Algorithm',
            [CIPHER]: fieldNames.cipher || 'Cipher',
            [LAST_HEIGHT]: fieldNames.lastHeight || 'Last Height',
            [BIRTH_TIME]: fieldNames.birthTime || 'Birth Time'
        };
    }

    static getReplaceWithMeFieldList() {
        return [];
    }

    static getShowQrCodeFieldList() {
        return [CIPHER];
    }

    static getInputFieldDefaultValueMap() {
        return {};
    }

    toJson() {
        return JSON.stringify(this);
    }

    static fromJson(json) {
        return Object.assign(new Secret(), JSON.parse(json));
    }
}

export default Secret; 