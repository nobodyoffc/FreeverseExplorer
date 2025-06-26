// Constants
import {
    ID,
    OWNER,
    VALUE,
    CDD
} from '../constants/fieldNames.js';
import {
    DEFAULT_ID_LENGTH,
    DEFAULT_AMOUNT_LENGTH,
    DEFAULT_CD_LENGTH
} from '../constants/constants.js';

class CashMark {
    constructor() {
        this.id = null;
        this.owner = null;
        this.value = null;
        this.cdd = null;
    }

    static getFieldWidthMap() {
        return {
            [ID]: DEFAULT_ID_LENGTH,
            [OWNER]: DEFAULT_ID_LENGTH,
            [VALUE]: DEFAULT_AMOUNT_LENGTH,
            [CDD]: DEFAULT_CD_LENGTH
        };
    }

    static getTimestampFieldList() {
        return [];
    }

    static getSatoshiFieldList() {
        return [VALUE];
    }

    static getHeightToTimeFieldMap() {
        return {};
    }

    static getShowFieldNameAsMap() {
        const currentLang = window.currentLanguage || 'en';
        const fieldNames = window.strings?.[currentLang]?.fieldNames || {};
        
        return {
            [ID]: fieldNames.id || 'ID',
            [OWNER]: fieldNames.owner || 'Owner',
            [VALUE]: fieldNames.value || 'Value',
            [CDD]: fieldNames.cdd || 'CDD'
        };
    }

    static getReplaceWithMeFieldList() {
        return [OWNER];
    }

    static getInputFieldDefaultValueMap() {
        return {};
    }

    toJson() {
        return JSON.stringify(this);
    }

    static fromJson(json) {
        return Object.assign(new CashMark(), JSON.parse(json));
    }

    toBytes() {
        return new TextEncoder().encode(this.toJson());
    }

    static fromBytes(bytes) {
        return CashMark.fromJson(new TextDecoder().decode(bytes));
    }
}

export default CashMark; 