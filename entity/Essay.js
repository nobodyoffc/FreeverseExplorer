import {
    BIRTH_TIME,
    BIRTH_HEIGHT,
    LAST_TIME,
    LAST_HEIGHT,
    LAST_TX_ID,
    T_CDD,
    T_RATE,
    TITLE,
    VER,
    DID,
    LANG,
    PUBLISHER,
    AUTHORS
} from '../constants/fieldNames.js';
import {
    DEFAULT_ID_LENGTH,
    DEFAULT_TIME_LENGTH,
    DEFAULT_CD_LENGTH,
    DEFAULT_BOOLEAN_LENGTH
} from '../constants/constants.js';

class Essay {
    constructor() {
        this.id = null;
        this.title = null;
        this.ver = null;
        this.did = null;
        this.authors = null;
        this.lang = null;
        this.publisher = null;
        this.birthTime = null;
        this.birthHeight = null;
        this.lastTxId = null;
        this.lastTime = null;
        this.lastHeight = null;
        this.tCdd = null;
        this.tRate = null;
        this.deleted = null;
    }

    static getFieldWidthMap() {
        return {
            [PUBLISHER]: DEFAULT_ID_LENGTH,
            [TITLE]: DEFAULT_ID_LENGTH,
            [BIRTH_TIME]: DEFAULT_TIME_LENGTH,
            [DID]: DEFAULT_ID_LENGTH,
            [T_CDD]: DEFAULT_CD_LENGTH,
            [T_RATE]: DEFAULT_CD_LENGTH,
            [LAST_HEIGHT]: DEFAULT_BOOLEAN_LENGTH,
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
            [TITLE]: fieldNames.title || 'Title',
            [VER]: fieldNames.ver || 'Version',
            [DID]: fieldNames.did || 'DID',
            [AUTHORS]: fieldNames.authors || 'Authors',
            [LANG]: fieldNames.lang || 'Language',
            [PUBLISHER]: fieldNames.publisher || 'Publisher',
            [LAST_HEIGHT]: fieldNames.lastHeight || 'Last Height',
            [BIRTH_TIME]: fieldNames.birthTime || 'Birth Time'
        };
    }

    static getReplaceWithMeFieldList() {
        return [];
    }

    static getInputFieldDefaultValueMap() {
        return {};
    }

    toJson() {
        return JSON.stringify(this);
    }

    static fromJson(json) {
        return Object.assign(new Essay(), JSON.parse(json));
    }
}

export default Essay; 