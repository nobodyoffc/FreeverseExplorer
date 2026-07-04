// Constants
import {
    ID,
    CID,
    BALANCE,
    CASH,
    INCOME,
    EXPEND,
    CD,
    CDD,
    NAME_TIME,
    LAST_HEIGHT,
    LAST_TIME,
    FID,
    USED_CIDS,
    PUBKEY,
    IS_NOBODY,
    HOME,
    GUIDE,
    MASTER,
    BTC_ADDR,
    ETH_ADDR,
    LTC_ADDR,
    DOGE_ADDR,
    TRX_ADDR,
    BCH_ADDR
} from '../constants/fieldNames.js';
import {
    DEFAULT_ID_LENGTH,
    DEFAULT_TIME_LENGTH,
    DEFAULT_CD_LENGTH,
    DEFAULT_AMOUNT_LENGTH,
    DEFAULT_BOOLEAN_LENGTH
} from '../constants/constants.js';

class Cid {
    constructor() {
        this.cid = null;        // current CID
        this.id = null;
        this.usedCids = null;   // list of previously used CIDs
        this.pubkey = null;     // public key
        this.prikey = null;
        this.isNobody = null;   // whether this is a nobody address

        this.balance = null;        // value of fch in satoshi
        this.cash = null;        // Count of UTXO
        this.income = null;        // total amount of fch received in satoshi
        this.expend = null;        // total amount of fch pay in satoshi

        this.cd = null;        // CoinDays
        this.cdd = null;        // the total amount of coindays destroyed
        this.reputation = null;
        this.hot = null;
        this.weight = null;

        this.master = null;
        this.guide = null;    // the address of the address which sent the first fch to this address
        this.noticeFee = null;
        this.home = null;

        this.btcAddr = null;    // the btc address
        this.ethAddr = null;    // the eth address
        this.ltcAddr = null;    // the ltc address
        this.dogeAddr = null;    // the doge address
        this.trxAddr = null;    // the trx address
        this.bchAddr = null;    // the bch address

        this.birthHeight = null;    // the height where this address got its first fch
        this.nameTime = null;
        this.lastHeight = null;     // the height where this address info changed latest
    }

    static getFieldWidthMap() {
        return {
            [CID]: DEFAULT_CD_LENGTH,
            [ID]: DEFAULT_ID_LENGTH,
            [BALANCE]: DEFAULT_AMOUNT_LENGTH,
            [CASH]: DEFAULT_AMOUNT_LENGTH,
            [CD]: DEFAULT_CD_LENGTH,
            [CDD]: DEFAULT_CD_LENGTH,
            [LAST_HEIGHT]: DEFAULT_BOOLEAN_LENGTH,
            [NAME_TIME]: DEFAULT_TIME_LENGTH
        };
    }

    static getTimestampFieldList() {
        return [NAME_TIME];
    }

    static getSatoshiFieldList() {
        return [BALANCE, INCOME, EXPEND];
    }

    static getHeightToTimeFieldMap() {
        return {
            [LAST_HEIGHT]: LAST_TIME
        };
    }

    static getShowFieldNameAsMap() {
        const currentLang = window.currentLanguage || 'en';
        const fieldNames = window.strings?.[currentLang]?.fieldNames || {};
        
        return {
            [ID]: fieldNames.fid || FID,
            [CD]: fieldNames.cd || 'CD',
            [CDD]: fieldNames.cdd || 'CDD'
        };
    }

    static getShowQrCodeFieldList() {
        return [ID, PUBKEY,GUIDE,MASTER,HOME,BTC_ADDR,ETH_ADDR,LTC_ADDR,DOGE_ADDR,TRX_ADDR,BCH_ADDR];
    }

    static getInputFieldDefaultValueMap() {
        return {};
    }

    reCalcWeight() {
        if (this.reputation === null) this.reputation = 0;
        if (this.cdd === null) this.cdd = 0;
        if (this.cd === null) this.cd = 0;
        this.weight = this.calcWeight(this.cd, this.cdd, this.reputation);
    }

    calcWeight(cd, cdd, reputation) {
        // Implement weight calculation logic here
        return cd + cdd + reputation;
    }
}

export default Cid; 