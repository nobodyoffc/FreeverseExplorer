
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
    STD_NAME,
    LOCAL_NAMES,
    DESC,
    MEMBERS,
    MEMBER_NUM,
    ID
} from '../constants/fieldNames.js';
import {
    DEFAULT_ID_LENGTH,
    DEFAULT_AMOUNT_LENGTH,
    DEFAULT_CD_LENGTH,
    DEFAULT_BOOLEAN_LENGTH,
    DEFAULT_TIME_LENGTH
} from '../constants/constants.js';

class Team {
    constructor() {
        this.id = null;
        this.owner = null;
        this.stdName = null;
        this.localNames = null;
        this.waiters = null;
        this.accounts = null;
        this.consensusId = null;
        this.desc = null;
        this.members = null;
        this.memberNum = null;
        this.exMembers = null;
        this.managers = null;
        this.transferee = null;
        this.invitees = null;
        this.notAgreeMembers = null;
        this.birthTime = null;
        this.birthHeight = null;
        this.lastTxId = null;
        this.lastTime = null;
        this.lastHeight = null;
        this.tCdd = null;
        this.tRate = null;
        this.active = null;
    }

    static getFieldWidthMap() {
        return {
            [OWNER]: DEFAULT_ID_LENGTH,
            [STD_NAME]: DEFAULT_ID_LENGTH,
            [MEMBER_NUM]: DEFAULT_BOOLEAN_LENGTH,
            [DESC]: DEFAULT_ID_LENGTH,
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
            [STD_NAME]: fieldNames.stdName || 'Standard Name',
            [LOCAL_NAMES]: fieldNames.localNames || 'Local Names',
            [DESC]: fieldNames.desc || 'Description',
            [MEMBERS]: fieldNames.members || 'Members',
            [MEMBER_NUM]: fieldNames.memberNum || 'Member Number',
            [BIRTH_TIME]: fieldNames.birthTime || 'Birth Time',
            [BIRTH_HEIGHT]: fieldNames.birthHeight || 'Birth Height',
            [LAST_TX_ID]: fieldNames.lastTxId || 'Last TX ID',
            [LAST_TIME]: fieldNames.lastTime || 'Last Time',
            [LAST_HEIGHT]: fieldNames.lastHeight || 'Last Height',
            [T_CDD]: fieldNames.tCdd || 'Total CDD',
            [T_RATE]: fieldNames.tRate || 'Total Rate',
            [ACTIVE]: fieldNames.active || 'Active'
        };
    }

    static getReplaceWithMeFieldList() {
        return [OWNER];
    }

    static getInputFieldDefaultValueMap() {
        return {};
    }

    toJson() {
        return JSON.stringify(this);
    }

    toNiceJson() {
        return JSON.stringify(this, null, 2);
    }

    static fromJson(json) {
        return Object.assign(new Team(), JSON.parse(json));
    }
}

export default Team; 