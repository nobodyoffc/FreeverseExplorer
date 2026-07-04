// Constants
import {
    BIRTH_TIME,
    BIRTH_HEIGHT,
    ID,
    TITLE,
    CONTENT,
    PUBLISHER
} from '../constants/fieldNames.js';
import {
    DEFAULT_ID_LENGTH,
    DEFAULT_TIME_LENGTH,
    DEFAULT_BOOLEAN_LENGTH
} from '../constants/constants.js';

class Statement {
    constructor() {
        // Basic properties
        this.id = null;
        this.title = null;
        this.content = null;
        this.publisher = null;
        this.birthTime = null;
        this.birthHeight = null;
    }

    static getFieldWidthMap() {
        return {
            [PUBLISHER]: DEFAULT_ID_LENGTH,
            [TITLE]: DEFAULT_ID_LENGTH,
            [CONTENT]: DEFAULT_ID_LENGTH,
            [BIRTH_TIME]: DEFAULT_TIME_LENGTH,
            [ID]: DEFAULT_ID_LENGTH,

        };
    }

    static getTimestampFieldList() {
        return [BIRTH_TIME];
    }

    static getSatoshiFieldList() {
        return [];
    }

    static getHeightToTimeFieldMap() {
        return {
            [BIRTH_HEIGHT]: BIRTH_TIME
        };
    }

    static getShowFieldNameAsMap() {
        const currentLang = window.currentLanguage || 'en';
        const fieldNames = window.strings?.[currentLang]?.fieldNames || {};
        
        return {
            [ID]: fieldNames.id || 'ID',
            [PUBLISHER]: fieldNames.publisher || 'Publisher',
            [TITLE]: fieldNames.title || 'Title',
            [CONTENT]: fieldNames.content || 'Content',
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
        return Object.assign(new Statement(), JSON.parse(json));
    }
}

export default Statement; 