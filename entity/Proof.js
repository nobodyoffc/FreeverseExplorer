import {
    BIRTH_TIME,
    BIRTH_HEIGHT,
    LAST_TIME,
    LAST_HEIGHT,
    LAST_TX_ID,
    TITLE,
    CONTENT,
    ISSUER,
    OWNER,
    COSIGNERS_INVITED,
    COSIGNERS_SIGNED,
    TRANSFERABLE,
    ACTIVE,
    DESTROYED
} from '../constants/fieldNames.js';
import {
    DEFAULT_ID_LENGTH,
    DEFAULT_TIME_LENGTH,
    DEFAULT_BOOLEAN_LENGTH
} from '../constants/constants.js';

class Proof {
    constructor() {
        this.id = null;
        this.title = null;
        this.content = null;
        this.cosignersInvited = null;
        this.cosignersSigned = null;
        this.transferable = null;
        this.active = null;
        this.destroyed = null;
        this.issuer = null;
        this.owner = null;
        this.birthTime = null;
        this.birthHeight = null;
        this.lastTxId = null;
        this.lastTime = null;
        this.lastHeight = null;
    }

    static getFieldWidthMap() {
        return {
            [ISSUER]: DEFAULT_ID_LENGTH,
            [TITLE]: DEFAULT_ID_LENGTH,
            [OWNER]: DEFAULT_ID_LENGTH,
            [CONTENT]: DEFAULT_ID_LENGTH,
            [BIRTH_TIME]: DEFAULT_TIME_LENGTH,
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
            [ISSUER]: fieldNames.issuer || 'Issuer',
            [OWNER]: fieldNames.owner || 'Owner',
            [TITLE]: fieldNames.title || 'Title',
            [CONTENT]: fieldNames.content || 'Content',
            [COSIGNERS_INVITED]: fieldNames.cosignersInvited || 'Cosigners Invited',
            [COSIGNERS_SIGNED]: fieldNames.cosignersSigned || 'Cosigners Signed',
            [TRANSFERABLE]: fieldNames.transferable || 'Transferable',
            [ACTIVE]: fieldNames.active || 'Active',
            [DESTROYED]: fieldNames.destroyed || 'Destroyed',
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
        return Object.assign(new Proof(), JSON.parse(json));
    }
}

export default Proof; 