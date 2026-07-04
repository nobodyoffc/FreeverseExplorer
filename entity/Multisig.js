// Constants
import {
    ID,
    BIRTH_TIME,
    BIRTH_HEIGHT,
    FIDS,
    PUBKEYS,
    REDEEM_SCRIPT,
    FID
} from '../constants/fieldNames.js';
import {
    DEFAULT_ID_LENGTH,
    DEFAULT_TIME_LENGTH,
    DEFAULT_BOOLEAN_LENGTH
} from '../constants/constants.js';

class Multisig {
    constructor() {
        this.id = null;

        this.m = null;
        this.n = null;
        this.fids = null;
        this.birthTime = null;
        this.birthHeight = null;
        this.birthTxId = null;
        this.pubkeys = null;
        this.redeemScript = null;

    }

    static getFieldWidthMap() {
        return {
            [ID]: DEFAULT_ID_LENGTH,
            'm': DEFAULT_BOOLEAN_LENGTH,
            'n': DEFAULT_BOOLEAN_LENGTH,
            [BIRTH_TIME]: DEFAULT_TIME_LENGTH
        };
    }

    static getTimestampFieldList() {
        return [BIRTH_TIME];
    }

    static getSatoshiFieldList() {
        return [BALANCE];
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
            [ID]: fieldNames.fid || FID,
            'm': fieldNames.required || 'Required',
            'n': fieldNames.members || 'Members'
        };
    }

    static getShowQrCodeFieldList() {
        return [ID, REDEEM_SCRIPT];
    }

    static getInputFieldDefaultValueMap() {
        return {};
    }

}

export default Multisig;