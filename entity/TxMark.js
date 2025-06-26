// Constants
import {
    ID,
    OUT_VALUE,
    FEE,
    CDD
} from '../constants/fieldNames.js';
import {
    DEFAULT_ID_LENGTH,
    DEFAULT_AMOUNT_LENGTH,
    DEFAULT_CD_LENGTH
} from '../constants/constants.js';

class TxMark {
    constructor() {
        this.id = null;
        this.outValue = null;
        this.fee = null;
        this.cdd = null;
    }

    static getFieldWidthMap() {
        return {
            [ID]: DEFAULT_ID_LENGTH,
            [OUT_VALUE]: DEFAULT_AMOUNT_LENGTH,
            [FEE]: DEFAULT_BOOLEAN_LENGTH,
            [CDD]: DEFAULT_CD_LENGTH
        };
    }

    static getTimestampFieldList() {
        return [];
    }

    static getSatoshiFieldList() {
        return [VALUE, FEE];
    }

    static getHeightToTimeFieldMap() {
        return {};
    }

    static getShowFieldNameAsMap() {
        const currentLang = window.currentLanguage || 'en';
        const fieldNames = window.strings?.[currentLang]?.fieldNames || {};
        
        return {
            [ID]: fieldNames.id || 'ID',
            [VALUE]: fieldNames.value || 'Value',
            [FEE]: fieldNames.fee || 'Fee',
            [CDD]: fieldNames.cdd || 'CDD'
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
        return Object.assign(new TxMark(), JSON.parse(json));
    }

    toBytes() {
        return new TextEncoder().encode(this.toJson());
    }

    static fromBytes(bytes) {
        return TxMark.fromJson(new TextDecoder().decode(bytes));
    }
}

export default TxMark; 