// Constants
import {
    OWNER,
    BIRTH_TIME,
    BIRTH_HEIGHT,
    LAST_TX_ID,
    LAST_TIME,
    LAST_HEIGHT,
    T_CDD,
    T_RATE,
    ACTIVE,
    CLOSED,
    CLOSE_STATEMENT,
    NAME,
    VER,
    DID,
    DESC,
    LANGS,
    URLS,
    PROTOCOLS,
    WAITERS
} from '../constants/fieldNames.js';
import {
    DEFAULT_ID_LENGTH,
    DEFAULT_AMOUNT_LENGTH,
    DEFAULT_CD_LENGTH,
    DEFAULT_BOOLEAN_LENGTH,
    DEFAULT_TIME_LENGTH
} from '../constants/constants.js';

class Code {
    constructor() {
        // Basic properties
        this.name = null;
        this.ver = null;
        this.did = null;
        this.desc = null;
        this.langs = null;
        this.urls = null;
        this.protocols = null;
        this.waiters = null;

        // Status properties
        this.owner = null;
        this.birthTime = null;
        this.birthHeight = null;
        this.lastTxId = null;
        this.lastTime = null;
        this.lastHeight = null;
        this.tCdd = null;
        this.tRate = null;
        this.active = null;
        this.closed = null;
        this.closeStatement = null;
    }

    static getFieldWidthMap() {
        return {
            [OWNER]: DEFAULT_ID_LENGTH,
            [NAME]: DEFAULT_ID_LENGTH,
            [T_RATE]: DEFAULT_AMOUNT_LENGTH,
            [T_CDD]: DEFAULT_AMOUNT_LENGTH,
            [DESC]: DEFAULT_ID_LENGTH,
            [LAST_TIME]: DEFAULT_TIME_LENGTH,
            [BIRTH_TIME]: DEFAULT_TIME_LENGTH
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
            [OWNER]: fieldNames.owner || 'Owner',
            [NAME]: fieldNames.name || 'Name',
            [DID]: fieldNames.did || 'DID',
            [DESC]: fieldNames.desc || 'Description',
            [LANGS]: fieldNames.langs || 'Languages',
            [URLS]: fieldNames.urls || 'URLs',
            [PROTOCOLS]: fieldNames.protocols || 'Protocols',
            [WAITERS]: fieldNames.waiters || 'Waiters',
            [ACTIVE]: fieldNames.active || 'Active',
            [CLOSED]: fieldNames.closed || 'Closed',
            [T_CDD]: fieldNames.tCdd || 'Total CDD',
            [T_RATE]: fieldNames.tRate || 'Total Rate',
            [LAST_TIME]: fieldNames.lastTime || 'Last Time',
            [BIRTH_TIME]: fieldNames.birthTime || 'Birth Time'
        };
    }

    static getReplaceWithMeFieldList() {
        return [OWNER];
    }

    static getInputFieldDefaultValueMap() {
        return {};
    }

    // Static methods
    static fromMap(map) {
        const code = new Code();
        
        code.name = map[NAME];
        code.ver = map[VER];
        code.did = map[DID];
        code.desc = map[DESC];
        code.langs = map[LANGS]?.split(',');
        code.urls = map[URLS]?.split(',');
        code.protocols = map[PROTOCOLS]?.split(',');
        code.waiters = map[WAITERS]?.split(',');
        
        code.owner = map[OWNER];
        code.birthTime = map[BIRTH_TIME] ? parseInt(map[BIRTH_TIME]) : null;
        code.birthHeight = map[BIRTH_HEIGHT] ? parseInt(map[BIRTH_HEIGHT]) : null;
        code.lastTxId = map[LAST_TX_ID];
        code.lastTime = map[LAST_TIME] ? parseInt(map[LAST_TIME]) : null;
        code.lastHeight = map[LAST_HEIGHT] ? parseInt(map[LAST_HEIGHT]) : null;
        code.tCdd = map[T_CDD] ? parseInt(map[T_CDD]) : null;
        code.tRate = map[T_RATE] ? parseFloat(map[T_RATE]) : null;
        code.active = map[ACTIVE] === 'true';
        code.closed = map[CLOSED] === 'true';
        code.closeStatement = map[CLOSE_STATEMENT];

        return code;
    }

    toJson() {
        return JSON.stringify(this);
    }

    static fromJson(json) {
        return Object.assign(new Code(), JSON.parse(json));
    }
}

export default Code; 