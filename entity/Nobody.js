// Constants
import {
    ID,
    PRIKEY,
    LEAK_TIME,
    LEAK_HEIGHT,
    LEAK_TX_ID,
    FID
} from '../constants/fieldNames.js';
import {
    DEFAULT_ID_LENGTH,
    DEFAULT_TIME_LENGTH,
    DEFAULT_BOOLEAN_LENGTH
} from '../constants/constants.js';

class Nobody {
    constructor() {
        this.prikey = null;
        this.leakTime = null;
        this.leakHeight = null;
        this.leakTxId = null;
        this.leakTxIndex = null;
        this.id = null;
    }

    static getFieldWidthMap() {
        return {
            [ID]: DEFAULT_ID_LENGTH,
            [PRIKEY]: DEFAULT_ID_LENGTH,
            [LEAK_TIME]: DEFAULT_TIME_LENGTH,
            [LEAK_HEIGHT]: DEFAULT_BOOLEAN_LENGTH,
            [LEAK_TX_ID]: DEFAULT_ID_LENGTH
        };
    }

    static getTimestampFieldList() {
        return [LEAK_TIME];
    }

    static getSatoshiFieldList() {
        return [];
    }

    static getHeightToTimeFieldMap() {
        return {};
    }

    static getShowFieldNameAsMap() {
        const currentLang = window.currentLanguage || 'en';
        const fieldNames = window.strings?.[currentLang]?.fieldNames || {};
        
        return {
            [ID]: fieldNames.fid || FID
        };
    }

    static getReplaceWithMeFieldList() {
        return [OWNER, ISSUER];
    }

    static getInputFieldDefaultValueMap() {
        return {};
    }
}

export default Nobody; 