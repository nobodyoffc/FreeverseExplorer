// Constants
import {
    ID,
    HEIGHT,
    TIME,
    TX_COUNT,
    IN_VALUE_T,
    OUT_VALUE_T,
    FEE,
    CDD,
    BLOCK_ID,
    SIZE,
    VERSION,
    PRE_ID,
    MERKLE_ROOT,
    BITS,
    NONCE
} from '../constants/fieldNames.js';
import {
    DEFAULT_ID_LENGTH,
    DEFAULT_TIME_LENGTH,
    DEFAULT_CD_LENGTH,
    DEFAULT_BOOLEAN_LENGTH,
    DEFAULT_AMOUNT_LENGTH
} from '../constants/constants.js';

class BlockInfo {
    constructor() {
        this.height = null;      // block height
        this.time = null;        // block timestamp
        this.id = null;
        this.txCount = null;     // number of TXs included
        this.size = null;        // block size
        this.inValueT = null;    // total amount of all inputs values in satoshi
        this.outValueT = null;   // total amount of all outputs values in satoshi
        this.fee = null;         // total amount of tx fee in satoshi
        this.cdd = null;         // total amount of coindays destroyed
        this.version = null;     // version
        this.preId = null;       // previous block hash
        this.merkleRoot = null;  // merkle tree root
        this.bits = null;        // The current difficulty target
        this.nonce = null;       // nonce

        // BlockHas properties
        this.txList = null;
    }

    static getFieldWidthMap() {
        return {
            [HEIGHT]: DEFAULT_ID_LENGTH,
            [TIME]: DEFAULT_TIME_LENGTH ,
            [ID]: DEFAULT_ID_LENGTH,
            [TX_COUNT]: DEFAULT_BOOLEAN_LENGTH,
            [IN_VALUE_T]: DEFAULT_AMOUNT_LENGTH,
            [FEE]: DEFAULT_BOOLEAN_LENGTH,
            [CDD]: DEFAULT_CD_LENGTH
        };
    }

    static getTimestampFieldList() {
        return [TIME];
    }

    static getSatoshiFieldList() {
        return [IN_VALUE_T, OUT_VALUE_T];
    }

    static getHeightToTimeFieldMap() {
        return {};
    }

    static getShowFieldNameAsMap() {
        const currentLang = window.currentLanguage || 'en';
        const fieldNames = window.strings?.[currentLang]?.fieldNames || {};
        
        return {
            [ID]: fieldNames.id || 'ID',
            [HEIGHT]: fieldNames.height || 'Height',
            [TIME]: fieldNames.time || 'Time',
            [TX_COUNT]: fieldNames.txCount || 'Tx Count',
            [IN_VALUE_T]: fieldNames.inValueT || 'Input Value',
            [FEE]: fieldNames.fee || 'Fee',
            [CDD]: fieldNames.cdd || 'CDD'
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
        return Object.assign(new BlockInfo(), JSON.parse(json));
    }

    toBytes() {
        return new TextEncoder().encode(this.toJson());
    }

    static fromBytes(bytes) {
        return BlockInfo.fromJson(new TextDecoder().decode(bytes));
    }
}

export default BlockInfo; 