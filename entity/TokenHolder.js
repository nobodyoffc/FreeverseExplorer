// Constants
import {
    ID,
    FID,
    TOKEN_ID,
    BALANCE,
    FIRST_HEIGHT,
    LAST_HEIGHT
} from '../constants/fieldNames.js';
import {
    DEFAULT_ID_LENGTH,
    DEFAULT_TIME_LENGTH,
    DEFAULT_CD_LENGTH,
    DEFAULT_BOOLEAN_LENGTH
} from '../constants/constants.js';

class TokenHolder {
    constructor() {
        this.id = null;
        this.fid = null;
        this.tokenId = null;
        this.balance = null;
        this.firstHeight = null;
        this.lastHeight = null;
    }

    static getFieldWidthMap() {
        return {
            [FID]: DEFAULT_ID_LENGTH,
            [TOKEN_ID]: DEFAULT_ID_LENGTH,
            [BALANCE]: DEFAULT_CD_LENGTH,
            [FIRST_HEIGHT]: DEFAULT_TIME_LENGTH,
            [LAST_HEIGHT]: DEFAULT_TIME_LENGTH
        };
    }

    static getTimestampFieldList() {
        return [];
    }

    static getSatoshiFieldList() {
        return [];
    }

    static getHeightToTimeFieldMap() {
        return {
            [FIRST_HEIGHT]: null,
            [LAST_HEIGHT]: null
        };
    }

    static getShowFieldNameAsMap() {
        const currentLang = window.currentLanguage || 'en';
        const fieldNames = window.strings?.[currentLang]?.fieldNames || {};
        
        return {
            [FID]: fieldNames.fid || 'FID',
            [TOKEN_ID]: fieldNames.tokenId || 'Token ID',
            [BALANCE]: fieldNames.balance || 'Balance',
            [FIRST_HEIGHT]: fieldNames.firstHeight || 'First Height',
            [LAST_HEIGHT]: fieldNames.lastHeight || 'Last Height'
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
        return Object.assign(new TokenHolder(), JSON.parse(json));
    }
}

export default TokenHolder;
