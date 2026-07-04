// Constants
import {
    ID,
    SIGNER,
    OP_RETURN,
    CDD,
    PAID,
    TIME,
    HEIGHT,
    OP_RETURN_ID
} from '../constants/fieldNames.js';
import {
    DEFAULT_ID_LENGTH,
    DEFAULT_BOOLEAN_LENGTH,
    DEFAULT_TIME_LENGTH,
    DEFAULT_CD_LENGTH
} from '../constants/constants.js';

class OpReturn {
    constructor() {
        this.id = null;
        this.signer = null; // address of the first input
        this.time = null;
        this.opReturn = null; // OP_RETURN text
        this.cdd = null;
        this.recipient = null; // address of the first output, but the first input address and opReturn output
        this.height = null; // block height
        this.txIndex = null; // tx index in the block
        this.paid = null; // paid
    }

    static getFieldWidthMap() {
        return {
            [SIGNER]: DEFAULT_ID_LENGTH,
            [OP_RETURN]: DEFAULT_ID_LENGTH,
            [TIME]: DEFAULT_TIME_LENGTH,
            [CDD]: DEFAULT_CD_LENGTH,
            [HEIGHT]: DEFAULT_BOOLEAN_LENGTH,
            [ID]: DEFAULT_ID_LENGTH,
        };
    }

    static getTimestampFieldList() {
        return [TIME];
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
            [SIGNER]: fieldNames.signer || 'Signer',
            [OP_RETURN]: fieldNames.opReturn || 'OP_RETURN',
            [CDD]: fieldNames.cdd || 'CDD',
            [TIME]: fieldNames.time || 'Time',
            [PAID]: fieldNames.paid || 'Paid',
            [ID]: fieldNames.id || OP_RETURN_ID
        };
    }

    static getReplaceWithMeFieldList() {
        return [];
    }

    static getInputFieldDefaultValueMap() {
        return {};
    }

    static getShowQrCodeFieldList() {
        return [OP_RETURN];
    }

    toJson() {
        return JSON.stringify(this);
    }

    static fromJson(json) {
        return Object.assign(new OpReturn(), JSON.parse(json));
    }

    toBytes() {
        return new TextEncoder().encode(this.toJson());
    }

    static fromBytes(bytes) {
        return OpReturn.fromJson(new TextDecoder().decode(bytes));
    }
}

export default OpReturn; 