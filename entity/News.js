// Constants
import {
    ID,
    DOER,
    ACT,
    OBJECT_TYPE,
    OBJECT_ID,
    OBJECT_NAME,
    OBJECT_BRIEF,
    HEIGHT,
    TIME
} from '../constants/fieldNames.js';
import {
    DEFAULT_ID_LENGTH,
    DEFAULT_TIME_LENGTH,
    DEFAULT_HEIGHT_LENGTH
} from '../constants/constants.js';

class News {
    constructor() {
        // Basic properties
        this.id = null;
        this.doer = null;
        this.act = null;
        this.objectType = null;
        this.objectName = null;
        this.objectBrief = null;
        this.objectId = null;
        this.height = null;
        this.time = null;
    }

    static getFieldWidthMap() {
        return {
            [DOER]: DEFAULT_ID_LENGTH,
            [ACT]: DEFAULT_TIME_LENGTH,
            [OBJECT_TYPE]: DEFAULT_TIME_LENGTH,
            [OBJECT_NAME]: DEFAULT_TIME_LENGTH,
            [OBJECT_BRIEF]: DEFAULT_ID_LENGTH,
            [HEIGHT]: DEFAULT_HEIGHT_LENGTH,
            [TIME]: DEFAULT_TIME_LENGTH
        };
    }

    static getSnNameMap() {
        return {
            "1": "PROTOCOL",
            "2": "CODE", 
            "3": "CID",
            "4": "NOBODY",
            "5": "SERVICE",
            "6": "MASTER",
            "7": "MAIL",
            "8": "STATEMENT",
            "9": "LINKS",
            "10": "NOTICE_FEE",
            "11": "NID",
            "12": "CONTACT",
            "13": "BOX",
            "14": "PROOF",
            "15": "APP",
            "16": "REPUTATION",
            "17": "SECRET",
            "18": "TEAM",
            "19": "SQUARE",
            "20": "TOKEN",
            "21": "ESSAY",
            "22": "REPORT",
            "23": "PAPER",
            "24": "BOOK",
            "25": "ARTWORK",
            "26": "REMARK",
            "27": "SOUND",
            "28": "IMAGE",
            "29": "VIDEO"
        };
    }

    static getTimestampFieldList() {
        return [TIME];
    }

    static getSatoshiFieldList() {
        return [];
    }

    static getHeightToTimeFieldMap() {
        return {
            [HEIGHT]: TIME
        };
    }

    static getShowFieldNameAsMap() {
        const currentLang = window.currentLanguage || 'en';
        const fieldNames = window.strings?.[currentLang]?.fieldNames || {};

        return {
            [DOER]: fieldNames.doer || 'Doer',
            [ACT]: fieldNames.act || 'Act',
            [OBJECT_TYPE]: fieldNames.objectType || 'Object Type',
            [OBJECT_BRIEF]: fieldNames.objectBrief || 'Object Brief',
            [OBJECT_NAME]: fieldNames.objectName || 'Object Name',
            [OBJECT_ID]: fieldNames.objectId || 'Object ID',
            [HEIGHT]: fieldNames.height || 'Height',
            [TIME]: fieldNames.time || 'Time',
            [ID]: fieldNames.id || 'ID'
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
        return Object.assign(new News(), JSON.parse(json));
    }
}

export default News;
