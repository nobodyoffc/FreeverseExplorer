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
    STD_NAME,
    LOCAL_NAMES,
    DESC,
    VER,
    TYPES,
    URLS,
    WAITERS,
    PROTOCOLS,
    SERVICES,
    CODES,
    PARAMS
} from '../constants/fieldNames.js';
import {
    DEFAULT_ID_LENGTH,
    DEFAULT_AMOUNT_LENGTH,
    DEFAULT_CD_LENGTH,
    DEFAULT_BOOLEAN_LENGTH,
    DEFAULT_TIME_LENGTH
} from '../constants/constants.js';

class Service {
    constructor() {
        // Basic properties
        this.stdName = null;
        this.localNames = null;
        this.desc = null;
        this.ver = null;
        this.types = null;
        this.urls = null;
        this.waiters = null;
        this.protocols = null;
        this.services = null;
        this.codes = null;
        this.params = null;

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
            [STD_NAME]: DEFAULT_ID_LENGTH,
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
            [STD_NAME]: fieldNames.stdName || 'Standard Name',
            [LOCAL_NAMES]: fieldNames.localNames || 'Local Names',
            [DESC]: fieldNames.desc || 'Description',
            [VER]: fieldNames.ver || 'Version',
            [TYPES]: fieldNames.types || 'Types',
            [URLS]: fieldNames.urls || 'URLs',
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
    static fromMap(map, paramsClass) {
        const service = new Service();
        
        service.stdName = map[STD_NAME];
        service.localNames = map[LOCAL_NAMES]?.split(',');
        service.desc = map[DESC];
        service.ver = map[VER];
        service.types = map[TYPES]?.split(',');
        service.urls = map[URLS]?.split(',');
        service.waiters = map[WAITERS]?.split(',');
        service.protocols = map[PROTOCOLS]?.split(',');
        service.services = map[SERVICES]?.split(',');
        service.codes = map[CODES]?.split(',');
        
        service.owner = map[OWNER];
        service.birthTime = map[BIRTH_TIME] ? parseInt(map[BIRTH_TIME]) : null;
        service.birthHeight = map[BIRTH_HEIGHT] ? parseInt(map[BIRTH_HEIGHT]) : null;
        service.lastTxId = map[LAST_TX_ID];
        service.lastTime = map[LAST_TIME] ? parseInt(map[LAST_TIME]) : null;
        service.lastHeight = map[LAST_HEIGHT] ? parseInt(map[LAST_HEIGHT]) : null;
        service.tCdd = map[T_CDD] ? parseInt(map[T_CDD]) : null;
        service.tRate = map[T_RATE] ? parseFloat(map[T_RATE]) : null;
        service.active = map[ACTIVE] === 'true';
        service.closed = map[CLOSED] === 'true';
        service.closeStatement = map[CLOSE_STATEMENT];

        if (map[PARAMS] && paramsClass) {
            service.params = new paramsClass();
            Object.assign(service.params, JSON.parse(map[PARAMS]));
        }

        return service;
    }

    toJson() {
        return JSON.stringify(this);
    }

    static fromJson(json) {
        return Object.assign(new Service(), JSON.parse(json));
    }
}

export default Service; 