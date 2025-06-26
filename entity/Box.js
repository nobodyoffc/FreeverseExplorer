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
    BIRTH_HEIGHT,
    NAME,
    DESC,
    CONTAIN,
    LAST_TX_ID
} from '../constants/fieldNames.js';
import {
    DEFAULT_ID_LENGTH,
    DEFAULT_TIME_LENGTH,
    DEFAULT_BOOLEAN_LENGTH
} from '../constants/constants.js';

class Box {
    constructor() {
        this.id = null;
        this.name = null;
        this.desc = null;
        this.contain = null;
        this.cipher = null;
        this.alg = null;
        this.active = null;
        this.owner = null;
        this.birthTime = null;
        this.birthHeight = null;
        this.lastTxId = null;
        this.lastTime = null;
        this.lastHeight = null;
    }

    static getFieldWidthMap() {
        return {
            [OWNER]: DEFAULT_ID_LENGTH,
            [ID]: DEFAULT_ID_LENGTH,
            [NAME]: DEFAULT_ID_LENGTH,
            [CIPHER]: DEFAULT_ID_LENGTH,
            [LAST_TIME]: DEFAULT_TIME_LENGTH,
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

    static getShowQrCodeFieldList() {
        return [CONTAIN];
    }

    static getShowFieldNameAsMap() {
        const currentLang = window.currentLanguage || 'en';
        const fieldNames = window.strings?.[currentLang]?.fieldNames || {};
        
        return {
            [ID]: fieldNames.id || 'ID',
            [OWNER]: fieldNames.owner || 'Owner',
            [NAME]: fieldNames.name || 'Name',
            [DESC]: fieldNames.desc || 'Description',
            [CONTAIN]: fieldNames.contain || 'Contain',
            [ALG]: fieldNames.alg || 'Algorithm',
            [CIPHER]: fieldNames.cipher || 'Cipher',
            [LAST_TX_ID]: fieldNames.lastTxId || 'Last Transaction ID',
            [LAST_HEIGHT]: fieldNames.lastHeight || 'Last Height',
            [BIRTH_TIME]: fieldNames.birthTime || 'Birth Time'
        };
    }

    static getShowQrCodeFieldList() {
        return [CIPHER];
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
        return Object.assign(new Box(), JSON.parse(json));
    }
}

export default Box; 