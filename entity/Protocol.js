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
    TYPE,
    SN,
    VER,
    DID,
    NAME,
    LANG,
    DESC,
    PRE_PID,
    FILE_URLS,
    TITLE,
    WAITERS,
    PROTOCOLS
} from '../constants/fieldNames.js';
import {
    DEFAULT_ID_LENGTH,
    DEFAULT_AMOUNT_LENGTH,
    DEFAULT_CD_LENGTH,
    DEFAULT_BOOLEAN_LENGTH,
    DEFAULT_TIME_LENGTH
} from '../constants/constants.js';

class Protocol {
    constructor() {
        // Basic properties
        this.type = null;
        this.sn = null;
        this.ver = null;
        this.did = null;
        this.name = null;
        this.lang = null;
        this.desc = null;
        this.prePid = null;
        this.fileUrls = null;
        this.title = null;
        this.owner = null;
        this.waiters = null;

        // Status properties
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
            [TITLE]: DEFAULT_ID_LENGTH,
            [T_RATE]: DEFAULT_AMOUNT_LENGTH,
            [T_CDD]: DEFAULT_AMOUNT_LENGTH,
            [TYPE]: DEFAULT_AMOUNT_LENGTH,
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
            [TITLE]: fieldNames.title || 'Title',
            [DID]: fieldNames.did || 'DID',
            [DESC]: fieldNames.desc || 'Description',
            [TYPE]: fieldNames.type || 'Type',
            [SN]: fieldNames.sn || 'SN',
            [VER]: fieldNames.ver || 'Version',
            [LANG]: fieldNames.lang || 'Language',
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
        const protocol = new Protocol();
        
        protocol.type = map[TYPE];
        protocol.sn = map[SN];
        protocol.ver = map[VER];
        protocol.did = map[DID];
        protocol.name = map[NAME];
        protocol.lang = map[LANG];
        protocol.desc = map[DESC];
        protocol.prePid = map[PRE_PID];
        protocol.fileUrls = map[FILE_URLS]?.split(',');
        protocol.title = map[TITLE];
        protocol.owner = map[OWNER];
        protocol.waiters = map[WAITERS]?.split(',');
        
        protocol.birthTime = map[BIRTH_TIME] ? parseInt(map[BIRTH_TIME]) : null;
        protocol.birthHeight = map[BIRTH_HEIGHT] ? parseInt(map[BIRTH_HEIGHT]) : null;
        protocol.lastTxId = map[LAST_TX_ID];
        protocol.lastTime = map[LAST_TIME] ? parseInt(map[LAST_TIME]) : null;
        protocol.lastHeight = map[LAST_HEIGHT] ? parseInt(map[LAST_HEIGHT]) : null;
        protocol.tCdd = map[T_CDD] ? parseInt(map[T_CDD]) : null;
        protocol.tRate = map[T_RATE] ? parseFloat(map[T_RATE]) : null;
        protocol.active = map[ACTIVE] === 'true';
        protocol.closed = map[CLOSED] === 'true';
        protocol.closeStatement = map[CLOSE_STATEMENT];

        return protocol;
    }

    toJson() {
        return JSON.stringify(this);
    }

    static fromJson(json) {
        return Object.assign(new Protocol(), JSON.parse(json));
    }
}

export default Protocol; 