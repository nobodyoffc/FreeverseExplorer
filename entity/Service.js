// Constants
import {
    ID,
    OWNER,
    BIRTH_TIME,
    BIRTH_HEIGHT,
    LAST_TX_ID,
    LAST_TIME,
    LAST_HEIGHT,
    T_CDD,
    T_RATE,
    ACTIVE,
    CLOSED,
    CLOSE_STATEMENT,
    STD_NAME,
    LOCAL_NAMES,
    DESC,
    VER,
    DEALER,
    DEALER_PUBKEY,
    HOME,
    WAITERS,
    PROTOCOLS,
    SERVICES,
    CODES,
    PARAMS,
    PRICE_PER_KB,
    PRICE_PER_KB_IN,
    PRICE_PER_KB_OUT,
    PRICE_PER_DAY_KB,
    MIN_PAYMENT,
    PRICE_PER_REQUEST,
    SESSION_DAYS,
    CONSUME_VIA_SHARE,
    ORDER_VIA_SHARE,
    CURRENCY,
    TYPE,
    COMPONENTS
} from '../constants/fieldNames.js';
import {
    DEFAULT_ID_LENGTH,
    DEFAULT_AMOUNT_LENGTH,
    DEFAULT_CD_LENGTH,
    DEFAULT_BOOLEAN_LENGTH,
    DEFAULT_TIME_LENGTH
} from '../constants/constants.js';

class Service {
    constructor() {
        // Basic properties
        this.id = null;
        this.stdName = null;
        this.localNames = null;
        this.desc = null;
        this.ver = null;
        this.type = null;
        this.components = null;
        this.home = null;
        this.waiters = null;
        this.protocols = null;
        this.services = null;
        this.codes = null;
        this.params = null;

        // Status properties
        this.owner = null;
        this.dealer = null;
        this.dealerPubkey = null;
        
        // Pricing and service configuration fields
        this.pricePerKB = null;
        this.pricePerKBIn = null;
        this.pricePerKBOut = null;
        this.pricePerDayKB = null;
        this.minPayment = null;
        this.pricePerRequest = null;
        this.sessionDays = null;
        this.consumeViaShare = null;
        this.orderViaShare = null;
        this.currency = null;
        
        // Time and status properties
        this.birthTime = null;
        this.birthHeight = null;
        this.lastTxId = null;
        this.lastTime = null;
        this.lastHeight = null;
        this.tCdd = null;
        this.tRate = null;
        this.active = null;
        this.closed = null;
        this.closeStatement = null;
    }

    static getFieldWidthMap() {
        return {
            [OWNER]: DEFAULT_ID_LENGTH,
            [STD_NAME]: DEFAULT_ID_LENGTH,
            [TYPE]: DEFAULT_AMOUNT_LENGTH,
            [T_RATE]: DEFAULT_AMOUNT_LENGTH,
            [T_CDD]: DEFAULT_AMOUNT_LENGTH,
            [DESC]: DEFAULT_ID_LENGTH,
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
            [OWNER]: fieldNames.owner || 'Owner',
            [STD_NAME]: fieldNames.stdName || 'Standard Name',
            [LOCAL_NAMES]: fieldNames.localNames || 'Local Names',
            [DESC]: fieldNames.desc || 'Description',
            [VER]: fieldNames.ver || 'Version',
            [DEALER]: fieldNames.dealer || 'Dealer',
            [DEALER_PUBKEY]: fieldNames.dealerPubkey || 'Dealer Pubkey',
            [TYPE]: fieldNames.type || 'Type',
            [COMPONENTS]: fieldNames.components || 'Components',
            [HOME]: fieldNames.home || 'Home',
            [ACTIVE]: fieldNames.active || 'Active',
            [CLOSED]: fieldNames.closed || 'Closed',
            [T_CDD]: fieldNames.tCdd || 'Total CDD',
            [T_RATE]: fieldNames.tRate || 'Total Rate',
            [LAST_TIME]: fieldNames.lastTime || 'Last Time',
            [BIRTH_TIME]: fieldNames.birthTime || 'Birth Time',
            [PRICE_PER_KB]: fieldNames.pricePerKB || 'Price Per KB',
            [PRICE_PER_KB_IN]: fieldNames.pricePerKBIn || 'Price Per KB In',
            [PRICE_PER_KB_OUT]: fieldNames.pricePerKBOut || 'Price Per KB Out',
            [PRICE_PER_DAY_KB]: fieldNames.pricePerDayKB || 'Price Per Day KB',
            [MIN_PAYMENT]: fieldNames.minPayment || 'Min Payment',
            [PRICE_PER_REQUEST]: fieldNames.pricePerRequest || 'Price Per Request',
            [SESSION_DAYS]: fieldNames.sessionDays || 'Session Days',
            [CONSUME_VIA_SHARE]: fieldNames.consumeViaShare || 'Consume Via Share',
            [ORDER_VIA_SHARE]: fieldNames.orderViaShare || 'Order Via Share',
            [CURRENCY]: fieldNames.currency || 'Currency'
        };
    }

    static getReplaceWithMeFieldList() {
        return [OWNER];
    }

    static getInputFieldDefaultValueMap() {
        return {};
    }

    // Static methods
    static fromMap(map, paramsClass) {
        const service = new Service();
        
        service.id = map[ID];
        service.stdName = map[STD_NAME];
        service.localNames = map[LOCAL_NAMES];  // Now already an array from API
        service.desc = map[DESC];
        service.ver = map[VER];
        service.type = map[TYPE];
        service.components = map[COMPONENTS];  // Now already an array from API
        service.home = map[HOME];
        service.waiters = map[WAITERS];  // Now already an array from API
        service.protocols = map[PROTOCOLS];  // Now already an array from API
        service.services = map[SERVICES];  // Now already an array from API
        service.codes = map[CODES];  // Now already an array from API
        service.dealer = map[DEALER];
        service.dealerPubkey = map[DEALER_PUBKEY];
        service.owner = map[OWNER];
        
        // Pricing and service configuration fields
        service.pricePerKB = map[PRICE_PER_KB];
        service.pricePerKBIn = map[PRICE_PER_KB_IN];
        service.pricePerKBOut = map[PRICE_PER_KB_OUT];
        service.pricePerDayKB = map[PRICE_PER_DAY_KB];
        service.minPayment = map[MIN_PAYMENT];
        service.pricePerRequest = map[PRICE_PER_REQUEST];
        service.sessionDays = map[SESSION_DAYS];
        service.consumeViaShare = map[CONSUME_VIA_SHARE];
        service.orderViaShare = map[ORDER_VIA_SHARE];
        service.currency = map[CURRENCY];
        
        // Time and status properties
        service.birthTime = map[BIRTH_TIME] ? parseInt(map[BIRTH_TIME]) : null;
        service.birthHeight = map[BIRTH_HEIGHT] ? parseInt(map[BIRTH_HEIGHT]) : null;
        service.lastTxId = map[LAST_TX_ID];
        service.lastTime = map[LAST_TIME] ? parseInt(map[LAST_TIME]) : null;
        service.lastHeight = map[LAST_HEIGHT] ? parseInt(map[LAST_HEIGHT]) : null;
        service.tCdd = map[T_CDD] ? parseInt(map[T_CDD]) : null;
        service.tRate = map[T_RATE] ? parseFloat(map[T_RATE]) : null;
        service.active = map[ACTIVE] === true || map[ACTIVE] === 'true';
        service.closed = map[CLOSED] === true || map[CLOSED] === 'true';
        service.closeStatement = map[CLOSE_STATEMENT];

        if (map[PARAMS] && paramsClass) {
            service.params = new paramsClass();
            if (typeof map[PARAMS] === 'string') {
                Object.assign(service.params, JSON.parse(map[PARAMS]));
            } else {
                Object.assign(service.params, map[PARAMS]);
            }
        } else {
            service.params = map[PARAMS];
        }

        return service;
    }

    toJson() {
        return JSON.stringify(this);
    }

    static fromJson(json) {
        return Object.assign(new Service(), JSON.parse(json));
    }
}

export default Service; 
