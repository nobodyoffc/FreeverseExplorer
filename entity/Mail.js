import { 
    ID, BIRTH_TIME, BIRTH_HEIGHT, LAST_HEIGHT, ACTIVE,
    ALG, CIPHER, CIPHER_RECI,CIPHER_SEND, SENDER, RECIPIENT
} from '../constants/fieldNames.js';
import {DEFAULT_ID_LENGTH, DEFAULT_TIME_LENGTH } from '../constants/constants.js';

class Mail {
    constructor() {
        this.id = null;
        this.alg = null;
        this.cipher = null;
        this.cipherSend = null;
        this.cipherReci = null;
        this.textId = null;
        this.sender = null;
        this.recipient = null;
        this.birthTime = null;
        this.birthHeight = null;
        this.lastHeight = null;
        this.active = null;
    }

    static getFieldWidthMap() {
        return {
            [SENDER]: DEFAULT_ID_LENGTH,
            [RECIPIENT]: DEFAULT_ID_LENGTH,
            [BIRTH_TIME]: DEFAULT_TIME_LENGTH,
            [CIPHER]: DEFAULT_ID_LENGTH,
            [CIPHER_RECI]: DEFAULT_ID_LENGTH,
            [ID]: DEFAULT_ID_LENGTH
        };
    }

    static getShowFieldNameAsMap() {
        return {
            [ID]: 'ID',
            [ALG]: 'Algorithm',
            [SENDER]: 'Sender',
            [RECIPIENT]: 'Recipient',
            [BIRTH_TIME]: 'Birth Time',
            [CIPHER]: 'Cipher',
            [BIRTH_HEIGHT]: 'Birth Height',
            [LAST_HEIGHT]: 'Last Height',
            [ACTIVE]: 'Active'
        };
    }

    static getTimestampFieldList() {
        return [BIRTH_TIME];
    }

    static getSatoshiFieldList() {
        return [];
    }


    static getShowFieldNameAsMap() {
        const currentLang = window.currentLanguage || 'en';
        const fieldNames = window.strings?.[currentLang]?.fieldNames || {};
        
        return {
            [ID]: fieldNames.id || 'ID',
            [SENDER]: fieldNames.sender || 'Sender',
            [RECIPIENT]: fieldNames.recipient || 'Recipient',
            [CIPHER]: fieldNames.cipher || 'Cipher',
            [BIRTH_TIME]: fieldNames.birthTime || 'Birth Time',
            [BIRTH_HEIGHT]: fieldNames.birthHeight || 'Birth Height',
            [LAST_HEIGHT]: fieldNames.lastHeight || 'Last Height',
            [ACTIVE]: fieldNames.active || 'Active'
        };
    }

    static getLinkFieldList() {
        return [SENDER, RECIPIENT];
    }

    static getShowQrCodeFieldList() {
        return [CIPHER, CIPHER_RECI, CIPHER_SEND];
    }


    toJson() {
        return JSON.stringify(this);
    }

    static fromJson(json) {
        return Object.assign(new Mail(), JSON.parse(json));
    }
}

export default Mail; 