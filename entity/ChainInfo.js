class ChainInfo {
    constructor() {
        this.id = "";
        this.time = "";
        this.height = "";
        this.blockId = "";
        this.totalSupply = "";
        this.circulating = "";
        this.difficulty = "";
        this.hashRate = "";
        this.chainSize = "";
        this.coinbaseMine = "";
        this.coinbaseFund = "";
        this.initialCoinbaseMine = "";
        this.initialCoinbaseFund = "";
        this.mineReductionRatio = "";
        this.fundReductionRatio = "";
        this.reducePerBlocks = "";
        this.reductionStopsAtHeight = "";
        this.stableAnnualIssuance = "";
        this.mineMatureDays = "";
        this.fundMatureDays = "";
        this.daysPerYear = "";
        this.blockTimeMinute = "";
        this.genesisBlockId = "";
        this.startTime = "";
        this.year = "";
        this.daysToNextYear = "";
        this.heightOfNextYear = "";
    }

    static getShowQrCodeFieldList() {
        return [];
    }

    static getTimestampFieldList() {
        return [];
    }

    static getSatoshiFieldList() {
        return [];
    }

    static getShowFieldNameAsMap() {
        const currentLang = window.currentLanguage || 'en';
        const fieldNames = window.strings?.[currentLang]?.fieldNames || {};
        
        return {
            id: fieldNames.id || 'ID',
            time: fieldNames.time || 'Time',
            height: fieldNames.height || 'Height',
            blockId: fieldNames.blockId || 'Block ID',
            totalSupply: fieldNames.totalSupply || 'Total Supply',
            circulating: fieldNames.circulating || 'Circulating',
            difficulty: fieldNames.difficulty || 'Difficulty',
            hashRate: fieldNames.hashRate || 'Hash Rate',
            chainSize: fieldNames.chainSize || 'Chain Size',
            coinbaseMine: fieldNames.coinbaseMine || 'Coinbase Mine',
            coinbaseFund: fieldNames.coinbaseFund || 'Coinbase Fund',
            initialCoinbaseMine: fieldNames.initialCoinbaseMine || 'Initial Coinbase Mine',
            initialCoinbaseFund: fieldNames.initialCoinbaseFund || 'Initial Coinbase Fund',
            mineReductionRatio: fieldNames.mineReductionRatio || 'Mine Reduction Ratio',
            fundReductionRatio: fieldNames.fundReductionRatio || 'Fund Reduction Ratio',
            reducePerBlocks: fieldNames.reducePerBlocks || 'Reduce Per Blocks',
            reductionStopsAtHeight: fieldNames.reductionStopsAtHeight || 'Reduction Stops At Height',
            stableAnnualIssuance: fieldNames.stableAnnualIssuance || 'Stable Annual Issuance',
            mineMatureDays: fieldNames.mineMatureDays || 'Mine Mature Days',
            fundMatureDays: fieldNames.fundMatureDays || 'Fund Mature Days',
            daysPerYear: fieldNames.daysPerYear || 'Days Per Year',
            blockTimeMinute: fieldNames.blockTimeMinute || 'Block Time Minute',
            genesisBlockId: fieldNames.genesisBlockId || 'Genesis Block ID',
            startTime: fieldNames.startTime || 'Start Time',
            year: fieldNames.year || 'Year',
            daysToNextYear: fieldNames.daysToNextYear || 'Days To Next Year',
            heightOfNextYear: fieldNames.heightOfNextYear || 'Height Of Next Year'
        };
    }
}

export default ChainInfo;

/*
private String time;
    private String height;
    private String blockId;
    private String totalSupply;
    private String circulating;
    private String difficulty;
    private String hashRate;
    private String chainSize;
    private String coinbaseMine;
    private String coinbaseFund;
    private final String initialCoinbaseMine= Constants.INITIAL_COINBASE_MINE;
    private final String initialCoinbaseFund= Constants.INITIAL_COINBASE_FUND;
    private final String mineReductionRatio = Constants.MINE_REDUCTION_RATIO;
    private final String fundReductionRatio = Constants.FUND_REDUCTION_RATIO;
    private final String reducePerBlocks = Constants.REDUCE_PER_BLOCKS;
    private final String reductionStopsAtHeight = Constants.REDUCTION_STOPS_AT_HEIGHT;
    private final String stableAnnualIssuance = Constants.STABLE_ANNUAL_ISSUANCE;
    private final String mineMatureDays = Constants.MINE_MATURE_DAYS;
    private final String fundMatureDays = Constants.FUND_MATURE_DAYS;
    private final String daysPerYear = Constants.DAYS_PER_YEAR_STR;
    private final String blockTimeMinute = Constants.BLOCK_TIME_MINUTE;
    private final String genesisBlockId = Constants.GENESIS_BLOCK_ID;
    private final String startTime = String.valueOf(Constants.START_TIME);
    private String year;
    private String daysToNextYear;
    private String heightOfNextYear;
*/