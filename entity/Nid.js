// Constants
import {
    NAMER,
    NAME,
    OID,
    BIRTH_TIME,
    LAST_TIME,
    NID,
    ID
} from '../constants/fieldNames.js';
import {
    DEFAULT_ID_LENGTH,
    DEFAULT_TIME_LENGTH
} from '../constants/constants.js';

class Nid {
    constructor() {
        this.nid = null;
        this.name = null;
        this.desc = null;
        this.oid = null;
        
        this.namer = null;
        this.birthTime = null;
        this.birthHeight = null;
        this.lastTime = null;
        this.lastHeight = null;
        this.active = null;
        this.id = null;
    }

    static getFieldWidthMap() {
        return {
            [NID]: DEFAULT_ID_LENGTH,
            [OID]: DEFAULT_ID_LENGTH,
            [BIRTH_TIME]: DEFAULT_TIME_LENGTH,
            [ID]: DEFAULT_ID_LENGTH
        };
    }

    static getTimestampFieldList() {
        return [BIRTH_TIME, LAST_TIME];
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
            [OID]: fieldNames.objectId || 'Object ID'
        };
    }

    static getReplaceWithMeFieldList() {
        return [];
    }

    static getInputFieldDefaultValueMap() {
        return {};
    }
}

export default Nid; 