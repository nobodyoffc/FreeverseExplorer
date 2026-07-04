class RawTxInfo {
    constructor() {
        this.id = null;
        this.sender = null;
        this.feeRate = null;
        this.inputs = null;
        this.outputs = null;
        this.opReturn = null;
        this.changeTo = null;
        this.lockTime = null;
        this.cd = null;
        this.multisig = null;
        this.ver = null;
        this.senderInfo = null;
        this.cdd = null;
        this.fidSigMap = null;
    }
}

/*
    private String sender;
    private Double feeRate;
    private List<Cash> inputs;
    private List<SendTo> outputs;
    private String opReturn;
    private String changeTo;
    private Long lockTime;
    private Long cd;
    private Multisig multisig;
    private String ver;
    private CidInfo senderInfo;
    private Long cdd;
    private Map<String, List<String>> fidSigMap;
    */

export default RawTxInfo;