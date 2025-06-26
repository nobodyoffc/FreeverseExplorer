// Constants
import {
    ID,
    IN_VALUE_T,
    OUT_VALUE_T,
    BLOCK_TIME,
    IN_COUNT,
    OUT_COUNT,
    FEE,
    CDD,
    OP_RE_BRIEF,
    HEIGHT,
    TX_INDEX,
    BLOCK_ID,
    LOCK_TIME,
    VERSION
} from '../constants/fieldNames.js';

// 默认显示宽度常量
import {
    DEFAULT_ID_LENGTH,
    DEFAULT_TIME_LENGTH ,
    DEFAULT_CD_LENGTH,
    DEFAULT_BOOLEAN_LENGTH,
    DEFAULT_AMOUNT_LENGTH
} from '../constants/constants.js';

class Tx {
    constructor() {
        // from block
        this.id = null;
        this.height = null;       // block height of the block
        this.blockTime = null;    // blockTime
        this.inCount = null;      // number of inputs
        this.outCount = null;     // number of outputs

        // calculated
        this.inValueT = null;     // total amount of inputs
        this.fee = null;          // tx fee
        this.cdd = null;          // cd

        this.version = null;      // version
        this.blockId = null;      // block ID, hash of block head
        this.txIndex = null;      // the index of this tx in the block
        this.coinbase = null;     // string of the coinbase script

        this.opReBrief = null;    // Former 30 bytes of OP_RETURN data in String
        this.lockTime = null;     // lockTime

    }

    // Static methods
    static getFieldWidthMap() {
        return {
            [ID]: DEFAULT_ID_LENGTH,
            [IN_VALUE_T]: DEFAULT_AMOUNT_LENGTH,
            [BLOCK_TIME]: DEFAULT_TIME_LENGTH ,
            [IN_COUNT]: DEFAULT_BOOLEAN_LENGTH,
            [OUT_COUNT]: DEFAULT_BOOLEAN_LENGTH,
            [FEE]: DEFAULT_BOOLEAN_LENGTH,
            [CDD]: DEFAULT_CD_LENGTH,
            [HEIGHT]: DEFAULT_BOOLEAN_LENGTH,
            [TX_INDEX]: DEFAULT_BOOLEAN_LENGTH
        };
    }

    static getTimestampFieldList() {
        return [BLOCK_TIME, LOCK_TIME];
    }

    static getSatoshiFieldList() {
        return [IN_VALUE_T, OUT_VALUE_T];
    }

    static getHeightToTimeFieldMap() {
        return {};
    }

    static getShowFieldNameAsMap() {
        // 可根据需要做多语言适配
        return {
            [ID]: 'cashId'
        };
    }

    static getReplaceWithMeFieldList() {
        return [];
    }

    static getInputFieldDefaultValueMap() {
        return {};
    }

    // 序列化
    toJson() {
        return JSON.stringify(this);
    }

    static fromJson(json) {
        return Object.assign(new Tx(), JSON.parse(json));
    }

    toBytes() {
        return new TextEncoder().encode(this.toJson());
    }

    static fromBytes(bytes) {
        return Tx.fromJson(new TextDecoder().decode(bytes));
    }
}

export default Tx; 