import {
    NAME,
    DESC,
    HOME,
    NAMERS,
    MEMBERS,
    MEMBER_NUM,
    BIRTH_TIME,
    BIRTH_HEIGHT,
    LAST_TX_ID,
    LAST_TIME,
    LAST_HEIGHT,
    ID,
    CDD_TO_UPDATE,
    T_CDD
} from '../constants/fieldNames.js';

import {
    DEFAULT_ID_LENGTH,
    DEFAULT_AMOUNT_LENGTH,
    DEFAULT_CD_LENGTH,
    DEFAULT_BOOLEAN_LENGTH,
    DEFAULT_TIME_LENGTH
} from '../constants/constants.js';

class Square {
    constructor() {
        // Basic properties
        this.id = null;
        this.name = null;
        this.desc = null;
        this.home = null;
        this.namers = null;
        this.members = null;
        this.memberNum = null;

        // Status properties
        this.birthTime = null;
        this.birthHeight = null;
        this.lastTxId = null;
        this.lastTime = null;
        this.lastHeight = null;
        this.cddToUpdate = null;
        this.tCdd = null;
    }

    static getFieldWidthMap() {
        return {
            [ID]: DEFAULT_ID_LENGTH,
            [NAME]: DEFAULT_ID_LENGTH,
            [MEMBER_NUM]: DEFAULT_BOOLEAN_LENGTH,
            [DESC]: DEFAULT_ID_LENGTH,
            [T_CDD]: DEFAULT_AMOUNT_LENGTH,
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
            [ID]: fieldNames.id || 'GID',
            [NAME]: fieldNames.name || 'Name',
            [DESC]: fieldNames.desc || 'Description',
            [NAMERS]: fieldNames.namers || 'Namers',
            [MEMBERS]: fieldNames.members || 'Members',
            [MEMBER_NUM]: fieldNames.memberNum || 'Member Number',
            [BIRTH_TIME]: fieldNames.birthTime || 'Birth Time',
            [BIRTH_HEIGHT]: fieldNames.birthHeight || 'Birth Height',
            [LAST_TX_ID]: fieldNames.lastTxId || 'Last TX ID',
            [LAST_TIME]: fieldNames.lastTime || 'Last Time',
            [LAST_HEIGHT]: fieldNames.lastHeight || 'Last Height',
            [CDD_TO_UPDATE]: fieldNames.cddToUpdate || 'CDD To Update',
            [T_CDD]: fieldNames.tCdd || 'Total CDD'
        };
    }

    static getReplaceWithMeFieldList() {
        return [];
    }

    static getInputFieldDefaultValueMap() {
        return {};
    }

    // Static methods
    static fromMap(map) {
        const group = new Square();
        
        group.name = map[NAME];
        group.desc = map[DESC];
        group.home = map[HOME];
        group.namers = map[NAMERS]?.split(',');
        group.members = map[MEMBERS]?.split(',');
        group.memberNum = map[MEMBER_NUM] ? parseInt(map[MEMBER_NUM]) : null;
        
        group.birthTime = map[BIRTH_TIME] ? parseInt(map[BIRTH_TIME]) : null;
        group.birthHeight = map[BIRTH_HEIGHT] ? parseInt(map[BIRTH_HEIGHT]) : null;
        group.lastTxId = map[LAST_TX_ID];
        group.lastTime = map[LAST_TIME] ? parseInt(map[LAST_TIME]) : null;
        group.lastHeight = map[LAST_HEIGHT] ? parseInt(map[LAST_HEIGHT]) : null;
        group.cddToUpdate = map[CDD_TO_UPDATE] ? parseInt(map[CDD_TO_UPDATE]) : null;
        group.tCdd = map[T_CDD] ? parseInt(map[T_CDD]) : null;

        return group;
    }

    toJson() {
        return JSON.stringify(this);
    }

    static fromJson(json) {
        return Object.assign(new Square(), JSON.parse(json));
    }
}

export default Square; 