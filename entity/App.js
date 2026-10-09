// Constants
import {
    ID,
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
    HOME,
    WAITERS,
    PROTOCOLS,
    CODES,
    SERVICES,
    DOWNLOADS,
    OS
} from '../constants/fieldNames.js';

import {
    DEFAULT_ID_LENGTH,
    DEFAULT_AMOUNT_LENGTH,
    DEFAULT_CD_LENGTH,
    DEFAULT_BOOLEAN_LENGTH,
    DEFAULT_TIME_LENGTH
} from '../constants/constants.js';

class App {
    constructor() {
        // Basic properties
        this.id = null;
        this.stdName = null;
        this.localNames = null;
        this.types = null;
        this.desc = null;
        this.ver = null;
        this.home = null;
        this.downloads = null;
        this.waiters = null;
        this.protocols = null;
        this.codes = null;
        this.services = null;

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
            [OS]: DEFAULT_ID_LENGTH,
            [DESC]: DEFAULT_ID_LENGTH,
            [T_RATE]: DEFAULT_AMOUNT_LENGTH,
            [T_CDD]: DEFAULT_AMOUNT_LENGTH,
            [LAST_TIME]: DEFAULT_TIME_LENGTH,
            [BIRTH_TIME]: DEFAULT_TIME_LENGTH,
            [ID]: DEFAULT_ID_LENGTH,
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
            [ID]: fieldNames.id || 'ID',
            [OWNER]: fieldNames.owner || 'Owner',
            [STD_NAME]: fieldNames.stdName || 'Standard Name',
            [LOCAL_NAMES]: fieldNames.localNames || 'Local Names',
            [DESC]: fieldNames.desc || 'Description',
            [VER]: fieldNames.ver || 'Version',
            [TYPES]: fieldNames.types || 'Types',
            [HOME]: fieldNames.home || 'Home',
            [ACTIVE]: fieldNames.active || 'Active',
            [CLOSED]: fieldNames.closed || 'Closed',
            [T_CDD]: fieldNames.tCdd || 'Total CDD',
            [T_RATE]: fieldNames.tRate || 'Total Rate',
            [LAST_TIME]: fieldNames.lastTime || 'Last Time',
            [DOWNLOADS]: fieldNames.downloads || 'Downloads',
            [OS]: fieldNames.os || 'OS',
            [WAITERS]: fieldNames.waiters || 'Waiters',
            [PROTOCOLS]: fieldNames.protocols || 'Protocols',
            [CODES]: fieldNames.codes || 'Codes',
            [SERVICES]: fieldNames.services || 'Services',
            [BIRTH_TIME]: fieldNames.birthTime || 'Birth Time',
            [BIRTH_HEIGHT]: fieldNames.birthHeight || 'Birth Height',
            [LAST_TX_ID]: fieldNames.lastTxId || 'Last TX ID',
            [LAST_TIME]: fieldNames.lastTime || 'Last Time',
            [LAST_HEIGHT]: fieldNames.lastHeight || 'Last Height',
        };
    }

    // Comma-joined list of distinct download.os values, e.g. 'macos, android'
    static getOsList(downloads) {
        if (typeof downloads === 'string') {
            try {
                downloads = JSON.parse(downloads);
            } catch (e) {
                return '';
            }
        }
        if (!Array.isArray(downloads)) return '';
        return [...new Set(downloads.map(d => d?.os).filter(Boolean))].join(', ');
    }

    static getReplaceWithMeFieldList() {
        return [];
    }

    static getInputFieldDefaultValueMap() {
        return {};
    }

    // Static methods
    static fromMap(map) {
        const app = new App();
        
        app.id = map[ID];
        app.stdName = map[STD_NAME];
        app.localNames = map[LOCAL_NAMES];
        app.types = map[TYPES]?.split(',');
        app.desc = map[DESC];
        app.ver = map[VER];
        app.home = map[HOME];
        app.downloads = map[DOWNLOADS] ? JSON.parse(map[DOWNLOADS]) : null;
        app.waiters = map[WAITERS]?.split(',');
        app.protocols = map[PROTOCOLS]?.split(',');
        app.codes = map[CODES]?.split(',');
        app.services = map[SERVICES]?.split(',');
        
        app.owner = map[OWNER];
        app.birthTime = map[BIRTH_TIME] ? parseInt(map[BIRTH_TIME]) : null;
        app.birthHeight = map[BIRTH_HEIGHT] ? parseInt(map[BIRTH_HEIGHT]) : null;
        app.lastTxId = map[LAST_TX_ID];
        app.lastTime = map[LAST_TIME] ? parseInt(map[LAST_TIME]) : null;
        app.lastHeight = map[LAST_HEIGHT] ? parseInt(map[LAST_HEIGHT]) : null;
        app.tCdd = map[T_CDD] ? parseInt(map[T_CDD]) : null;
        app.tRate = map[T_RATE] ? parseFloat(map[T_RATE]) : null;
        app.active = map[ACTIVE] === 'true';
        app.closed = map[CLOSED] === 'true';
        app.closeStatement = map[CLOSE_STATEMENT];

        return app;
    }

    toJson() {
        return JSON.stringify(this);
    }

    static fromJson(json) {
        return Object.assign(new App(), JSON.parse(json));
    }
}

export default App; 