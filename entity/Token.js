
// Constants
import {
    ID,
    BIRTH_TIME,
    BIRTH_HEIGHT,
    LAST_TIME,
    LAST_HEIGHT,
    LAST_TX_ID,
    NAME,
    VER,
    DEPLOYER,
    DESC,
    T_CDD,
    T_RATE,
    CIRCULATING,
    CLOSEABLE,
    OPEN_ISSUE,
    MAX_AMT_PER_ISSUE,
    MIN_CDD_PER_ISSUE,
    MAX_ISSUES_PER_ADDR,
    CLOSED,
    TRANSFERABLE,
    DESTROYED,
    DELETED
} from '../constants/fieldNames.js';
import {
    DEFAULT_ID_LENGTH,
    DEFAULT_TIME_LENGTH,
    DEFAULT_CD_LENGTH,
    DEFAULT_BOOLEAN_LENGTH
} from '../constants/constants.js';

class Token  {
    constructor() {
        this.id = null;
        this.name = null;
        this.desc = null;
        this.consensusId = null;
        this.capacity = null;
        this.decimal = null;
        this.transferable = null;
        this.closable = null;
        this.openIssue = null;
        this.maxAmtPerIssue = null;
        this.minCddPerIssue = null;
        this.maxIssuesPerAddr = null;
        this.closed = null;
        this.deployer = null;
        this.circulating = null;
        this.birthTime = null;
        this.birthHeight = null;
        this.lastTxId = null;
        this.lastTime = null;
        this.lastHeight = null;
    }

    static getFieldWidthMap() {
        return {
            [NAME]: DEFAULT_CD_LENGTH,
            [DEPLOYER]: DEFAULT_ID_LENGTH,
            [BIRTH_TIME]: DEFAULT_TIME_LENGTH,
            [CIRCULATING]: DEFAULT_CD_LENGTH,
            [DESC]: DEFAULT_ID_LENGTH,
            [OPEN_ISSUE]: DEFAULT_BOOLEAN_LENGTH,
            [TRANSFERABLE]: DEFAULT_BOOLEAN_LENGTH,
            [CLOSEABLE]: DEFAULT_BOOLEAN_LENGTH,
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
        return {
            [BIRTH_HEIGHT]: BIRTH_TIME,
            [LAST_HEIGHT]: LAST_TIME
        };
    }

    static getShowFieldNameAsMap() {
        const currentLang = window.currentLanguage || 'en';
        const fieldNames = window.strings?.[currentLang]?.fieldNames || {};
        
        return {
            [DEPLOYER]: fieldNames.deployer || 'Deployer',
            [NAME]: fieldNames.name || 'Name',
            [DESC]: fieldNames.desc || 'Description',
            [LAST_HEIGHT]: fieldNames.lastHeight || 'Last Height',
            [BIRTH_TIME]: fieldNames.birthTime || 'Birth Time'
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
        return Object.assign(new Token(), JSON.parse(json));
    }
}

export default Token;