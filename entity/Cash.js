// Constants
import {
    BIRTH_TIME,
    VALID,
    ISSUER,
    OWNER,
    VALUE,
    CD,
    CDD,
    ID,
    CASH_ID,
    LAST_TIME,
    BIRTH_TX_ID,
    SPEND_TIME,
    BIRTH_INDEX
} from '../constants/fieldNames.js';
import {
    DEFAULT_ID_LENGTH,
    DEFAULT_TIME_LENGTH,
    DEFAULT_CD_LENGTH,
    DEFAULT_BOOLEAN_LENGTH,
    DEFAULT_AMOUNT_LENGTH
} from '../constants/constants.js';

const COINBASE = 'coinbase';
const OneDayInterval = 24 * 60 * 60;

class Cash {
    constructor() {
        // Calculated
        this.id = null;
        this.owner = null; // address
        this.value = null; // in satoshi
        this.valid = null; // Is this cash valid (utxo), or spent (stxo)
        this.issuer = null; // first input fid when this cash was born
        this.lastTime = null;
        this.lastHeight = null;
        
        // From utxo
        this.birthTxId = null; // txid, hash in which this cash was created
        this.birthIndex = null; // index of cash. Order in cashs of the tx when created
        this.birthBlockId = null; // block ID, hash of block head
        this.birthTime = null; // Block time when this cash is created
        this.birthHeight = null; // Block height
        this.birthTxIndex = null; // Order in the block of the tx in which this cash was created
        this.type = null; // type of the script. P2PKH,P2SH,OP_RETURN,Unknown,MultiSig
        this.lockScript = null; // LockScript

        // From input
        this.spendTime = null; // Block time when spent
        this.spendTxId = null; // Tx hash when spent
        this.spendHeight = null; // Block height when spent
        this.spendTxIndex = null; // Order in the block of the tx in which this cash was spent
        this.spendBlockId = null; // block ID, hash of block head
        this.spendIndex = null; // Order in inputs of the tx when spent
        this.unlockScript = null; // unlock script
        this.sigHash = null; // sigHash
        this.sequence = null; // nSequence
        this.cdd = null; // CoinDays Destroyed
        this.cd = null; // CoinDays

    }

    static getFieldWidthMap() {
        return {
            [OWNER]: DEFAULT_ID_LENGTH,
            [VALID]: DEFAULT_BOOLEAN_LENGTH,
            [VALUE]: DEFAULT_AMOUNT_LENGTH,
            [LAST_TIME]: DEFAULT_TIME_LENGTH,
            [CD]: DEFAULT_CD_LENGTH,
            [CDD]: DEFAULT_CD_LENGTH,
            [BIRTH_TX_ID]: DEFAULT_ID_LENGTH,
            [ID]: DEFAULT_ID_LENGTH
        };
    }

    static getShowQrCodeFieldList() {
        return [ID, OWNER,ISSUER,VALUE,BIRTH_TX_ID];
    }

    static getTimestampFieldList() {
        return [BIRTH_TIME, LAST_TIME, SPEND_TIME];
    }

    static getSatoshiFieldList() {
        return [VALUE];
    }

    static getHeightToTimeFieldMap() {
        return {};
    }

    static getShowFieldNameAsMap() {
        const currentLang = window.currentLanguage || 'en';
        const fieldNames = window.strings?.[currentLang]?.fieldNames || {};
        
        return {
            [ID]: fieldNames.id || CASH_ID,
            [OWNER]: fieldNames.owner || 'Owner',
            [VALID]: fieldNames.valid || 'Valid',
            [VALUE]: fieldNames.value || 'Value',
            [LAST_TIME]: fieldNames.lastTime || 'Last Time',
            [CDD]: fieldNames.cdd || 'CDD',
            [BIRTH_TIME]: fieldNames.birthTime || 'Birth Time',
            [ISSUER]: fieldNames.issuer || 'Issuer'
        };
    }

    static getReplaceWithMeFieldList() {
        return [OWNER, ISSUER];
    }

    static getInputFieldDefaultValueMap() {
        return {};
    }

    static calculateCoinDays(value, startTime, endTime) {
        if (!value || !startTime || !endTime) {
            return 0;
        }
        const days = Math.floor((endTime - startTime) / (60 * 60 * 24));
        return Math.floor((value * days) / 100000000);
    }

}

export default Cash; 