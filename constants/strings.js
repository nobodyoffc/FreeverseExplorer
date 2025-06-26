// Internationalization (i18n) strings
const strings = {
    en: {
        // Header
        siteTitle: "Freeverse",

        
        // Code Messages
        codeMessage: {
            code0: "Success.",
            code1000: "Signature missing in request header.",
            code1001: "Pubkey missed in request header.",
            code1002: "SessionName missed in request header.",
            code1003: "Request body missed.",
            code1004: "Insufficient balance. Buy the service please.",
            code1005: "The request URL is not the same as the one you signed.",
            code1006: "Request expired.",
            code1007: "Nonce had been used.",
            code1008: "Failed to verify signature.",
            code1009: "NO such sessionName or it was expired. Please sign in again.",
            code1010: "Too much data to be requested.",
            code1011: "No data meeting the conditions.",
            code1012: "Bad query. Check your request body referring the documents.",
            code1013: "Bad request. Please check request body.",
            code1014: "The API is suspended",
            code1015: "FID missed in request header.",
            code1016: "Illegal URL.",
            code1017: "The http method is not available for this API.",
            code1018: "Nonce missed.",
            code1019: "Time missed.",
            code1020: "Other error.",
            code1021: "FID is Required.",
            code1022: "No such method.",
            code1023: "Miss sessionKey",
            code1024: "URL missed in the request body",
            code1025: "Wrong SID.",
            code1026: "Insufficient FCH on chain.",
            code1027: "Failed to parse cipher.",
            code1028: "Failed to sign in with prikey.",
            code1029: "Failed to decrypt.",
            code1030: "Failed to parse data.",
            code1031: "Miss destination.",
            code1032: "No such operation.",
            code1033: "Miss private key",
            code2001: "Free API is not active now.",
            code2002: "CID not found.",
            code2003: "Illegal FID.",
            code2004: "Raw TX must be in HEX.",
            code2005: "Send TX failed.",
            code2006: "App no found.",
            code2007: "Cash no found.",
            code2008: "Service no found.",
            code2009: "No free sessionKey.",
            code2010: "Error from freecash RPC.",
            code2020: "Failed to write data",
            code3001: "Http response is null.",
            code3002: "The request of GET is failed.",
            code3003: "Failed to close the http client.",
            code3004: "The URL of requesting is absent.",
            code3005: "The data object in response body is null.",
            code3006: "The status of response is wrong.",
            code3007: "Do POST request wrong.",
            code3008: "Do GET request wrong.",
            code3009: "DID missed.",
            code4001: "Failed to encrypt data.",
            code4002: "No such algorithm.",
            code4003: "No such provider.",
            code4004: "No such padding.",
            code4005: "Invalid algorithm parameter.",
            code4006: "Invalid key.",
            code4007: "Failed to parse hex.",
            code4008: "Wrong key length.",
            code4009: "Missing IV.",
            code4010: "The pubkey and prikey have to be from different key pairs.",
            code4011: "Bad sum: the first 4 bytes of the value of sha256(symkey+iv+did).",
            code4012: "The algorithm has to be assigned.",
            code4013: "Bad cipher.",
            code4014: "No such encrypt type."
        },
        
        // Navigation
        home: "Home",
        tools: "Tools", 
        developer: "Developer",
        swap: "Swap",
        downloads: "Downloads",
        
        // Developer Menu Items
        nodeOfFCH: "Node of FCH",
        sdk: "SDK",
        api: "API",
        docs: "Docs",
        sdkContent: "Under testing, will be released when ready...",
        apiContent: "Under testing, will be released when ready...",
        docsContent: "Under testing, will be released when ready...",
        chainInfo: "Chain Info",


        // Tools Menu Items
        myCash: "My Cash",
        offlineTX: "Offline TX",
        broadcastTX: "Broadcast TX",
        addressConvert: "Convert address",
        encrypt: "Encrypt",
        verifySignature: "Verify Signature",
        
        // My Cash Page
        myFid: "My FID",
        qrCode: "QR Code",
        createTx: "Create TX",

        // Description
        cashDescription: "The basic entity of the Satoshi framework. Live ones are also called UTXO.",
        txDescription: "The basic transaction of Freecash that spends cash and issues new cash",
        opReturnDescription: "Carve up to 4k bytes of anything you want on the Freecash blockchain",
        blockDescription: "Freecash block information",
        cidDescription: "CID (Crypto Identity) is the identity of the subject of Freeverse",
        nidDescription: "NID (Named Identity) is named by a subject ID for a object ID",
        nobodyDescription: "Nobody is an identity whose prikey has been made public",
        multisignDescription: "An identity consisting of multiple FIDs, which requires multiple signatures to create a TX",
        protocolDescription: "An open protocol market on chain",
        codeDescription: 'An open code market on chain',
        secretDescription: "Encrypted personal secrets stored on chain",
        mailDescription: "Encrypted mail which will always be delivered and permanently stored on chain",
        serviceDescription: "An open service market on chain",
        appDescription: "An open app market on chain",
        groupDescription: "An unmanaged organization type",
        teamDescription: "A managed organization type",
        boxDescription: "Encrypted personal containers stored on chain",
        essayDescription: 'Publish the DID of an essay on chain',
        reportDescription: "Publish the DID of a report on chain",
        paperDescription: 'Publish the DID of a paper on chain',
        bookDescription: 'Publish the DID of a book on chain',
        artworkDescription: 'Publish the DID of an artwork on chain',
        remarkDescription: 'Publish the DID of a remark on chain',
        proofDescription: 'On-chain proof issuing and managing system',
        tokenDescription: 'Open token system',
        groupDescription: 'An open, ownerless group that anyone can freely create, join, leave, and name',
        contactDescription: "Encrypted contacts saved on the chain",
        
        // Field Names
        fieldNames: {
            id: "ID",
            owner: "Owner",
            valid: "Valid",
            value: "Value",
            lastTime: "Last Time",
            lastHeight: "Last Height",
            cdd: "CDD",
            birthTime: "Birth Time",
            birthIndex: "Birth Index",
            type: "Type",
            lockScript: "Lock Script",
            birthTxId: "Birth TX ID",
            birthTxIndex: "Birth TX Index",
            birthBlockId: "Birth Block ID",
            birthHeight: "Birth Height",
            spendTime: "Spend Time",
            spendTxId: "Spend TX ID",
            spendHeight: "Spend Height",
            spendTxIndex: "Spend TX Index",
            spendBlockId: "Spend Block ID",
            spendIndex: "Spend Index",
            unlockScript: "Unlock Script",
            sigHash: "Sig Hash",
            sequence: "Sequence",
            cd: "CD",
            cashDetail: "Cash Detail",
            issuer: "Issuer",
            txDetail: "TX Detail",
            fee: "Fee",
            version: "Version",
            signer: "Signer",
            recipient: "Recipient",
            size: "Size",
            nonce: "Nonce",
            bits: "Bits",
            merkleRoot: "Merkle Root",
            preId: "Pre ID",
            opReturnId: "OpReturn ID",
            opReturn: "OpReturn",
            opReturnDetail: "OP_RETURN Detail",
            txCount: "TX Count",
            blockTime: "Block Time",
            outCount: "Out Count",
            inCount: "In Count",
            inValueT: "In Value",
            outValueT: "Out Value",
            height: "Height",
            txIndex: "TX Index",
            blockId: "Block ID",
            lockTime: "Lock Time",
            time: "Time",
            cid: "CID",
            cidDetail: "CID Detail",
            income: "Income",
            expend: "Expend",
            usedCids: "Used CIDs",
            pubkey: "Public Key",
            isNobody: "Is Nobody",
            fid: "FID",
            homepage: "Homepage",
            guide: "Guide",
            master: "Master",
            balance: "Balance",
            cash: "Cash",
            reputation: "Reputation",
            hot: "Hot",
            weight: "Weight",
            noticeFee: "Notice Fee",
            btcAddr: "BTC Address",
            ethAddr: "ETH Address",
            ltcAddr: "LTC Address",
            dogeAddr: "DOGE Address",
            trxAddr: "TRX Address",
            bchAddr: "BCH Address",
            nameTime: "Name Time",
            name: "Name",
            desc: "Description",
            oid: "Object ID",
            namer: "Namer",
            nidDetail: "NID Detail",
            nobodyDetail: "Nobody Detail",
            nobody: "Nobody",
            prikey: "Private Key",
            leakTime: "Leak Time",
            leakHeight: "Leak Height",
            leakTxId: "Leak Transaction ID",
            leakTxIndex: "Leak Transaction Index",
            multisignDetail: "Multisign Detail",
            required: "Required",
            members: "Members",
            fids: "FIDs",
            pubkeys: "Public Keys",
            redeemScript: "Redeem Script",
            // Protocol fields
            sn: 'SN',
            ver: 'Version',
            did: 'DID',
            lang: 'Language',
            prePid: 'Previous Protocol ID',
            fileUrls: 'File URLs',
            title: 'Title',
            waiters: 'Waiters',
            lastTxId: 'Last Transaction ID',
            tRate: 'Total Rate',
            active: 'Active',
            closed: 'Closed',
            closeStatement: 'Close Statement',
            sender: 'Sender',
            cipherSend: 'Cipher for Sender',
            cipherReci: 'Cipher for Recipient',
            textId: 'Text ID',
            // Code specific fields
            code: 'Code',
            codeDetail: 'Code Detail',
            langs: 'Languages',
            urls: 'URLs',
            protocols: 'Protocols',
            lastTxId: 'Last Transaction ID',
            // Service specific fields
            stdName: 'Standard Name',
            localNames: 'Local Names',
            types: 'Types',
            protocols: 'Protocols',
            services: 'Services',
            codes: 'Codes',
            params: 'Parameters',
            serviceDetail: 'Service Detail',
            appDetail: 'App Detail',
            downloads: 'Downloads',
            groupDetail: 'Group Detail',
            namers: 'Namers',
            memberNum: 'Member Number',
            cddToUpdate: 'CDD To Update',
            tCdd: 'Total CDD',
            teamDetail: "Team Detail",
            teamList: "Team List",
            alg: "Algorithm",
            cipher: "Cipher",
            box: "Box",
            boxDetail: "Box Detail",
            essayList: 'Essay List',
            essayDetail: 'Essay Detail',
            authors: 'Authors',
            publisher: 'Publisher',
            summary: 'Summary',
            paper: 'Paper',
            paperDetail: 'Paper Detail',
            keywords: 'Keywords',
            artworkDetail: 'Artwork Detail',
            remarkDetail: 'Remark Detail',
            onDid: 'On DID',
            proof: 'Proof',
            proofDetail: 'Proof Detail',
            content: 'Content',
            cosignersInvited: 'Cosigners Invited',
            cosignersSigned: 'Cosigners Signed',
            transferable: 'Transferable',
            destroyed: 'Destroyed',
            tokenHolder: 'Token Holder',
            tokenHolderDetail: 'Token Holder Detail',
            tokenId: 'Token ID',
            firstHeight: 'First Height',
            lastHeight: 'Last Height',
            tokenDetail: 'Token Detail',
            deployer: 'Deployer',
            circulating: 'Circulating',
            closeable: 'Closeable',
            openIssue: 'Open Issue',
            maxAmtPerIssue: 'Max Amount Per Issue',
            minCddPerIssue: 'Min CDD Per Issue',
            maxIssuesPerAddr: 'Max Issues Per Address',
            decimal: 'Decimal',
            capacity: 'Capacity',
            consensusId: 'Consensus ID',
            outValue: 'Issued Value',
            closable: 'Closable',
            nid: 'NID',
            secretDetail: 'Secret Detail',
            mailDetail: 'Mail Detail',
            contactList: 'Contact List',
            contactDetail: 'Contact Detail',
            decode: "Decode",
            decoding: "Decoding...",
            decodeFailed: "Decode failed",
            // Chain Info fields
            chainInfo: "Chain Info",
            totalSupply: "Total Supply",
            difficulty: "Difficulty",
            hashRate: "Hash Rate",
            chainSize: "Chain Size",
            coinbaseMine: "Coinbase Mine",
            coinbaseFund: "Coinbase Fund",
            initialCoinbaseMine: "Initial Coinbase Mine",
            initialCoinbaseFund: "Initial Coinbase Fund",
            mineReductionRatio: "Mine Reduction Ratio",
            fundReductionRatio: "Fund Reduction Ratio",
            reducePerBlocks: "Reduce Per Blocks",
            reductionStopsAtHeight: "Reduction Stops At Height",
            stableAnnualIssuance: "Stable Annual Issuance",
            mineMatureDays: "Mine Mature Days",
            fundMatureDays: "Fund Mature Days",
            daysPerYear: "Days Per Year",
            blockTimeMinute: "Block Time Minute",
            genesisBlockId: "Genesis Block ID",
            startTime: "Start Time",
            year: "Year",
            daysToNextYear: "Days To Next Year",
            heightOfNextYear: "Height Of Next Year"
        },

        // Overview Section
        blockchain: "Blockchain",
        block: "Block",
        tx: "TX",
        cash: "Cash",
        opreturn: "OpReturn",
        
        // Identity Section
        identity: "Identity",
        cid: "CID",
        nobody: "Nobody",
        multisign: "Multisign",
        nid: "NID",
        
        // Construct Section
        construct: "Construct",
        protocol: "Protocol",
        code: "Code",
        service: "Service",
        app: "APP",
        
        // Organization Section
        organization: "Organization",
        group: "Group",
        team: "Team",
        
        // Personal Section
        personal: "Personal",
        mail: "Mail",
        contact: "Contact",
        secret: "Secret",
        alg: "Algorithm",
        cipher: "Cipher",
        box: "Box",
        
        // Publish Section
        publish: "Publish",
        statement: "Statement",
        essay: "Essay",
        report: "Report",
        paper: "Paper",
        book: "Book",
        artwork: "Artwork",
        remark: "Remark",
        
        // Business Section
        business: "Business",
        proof: "Proof",
        token: "Token",
        tokenHolder: "Token Holder",
        
        // Charts Section
        dataVisualization: "Data Visualization",
        toolsSection: "Tools",
        lineChart: "Line Chart",
        barChart: "Bar Chart", 
        pieChart: "Pie Chart",
        
        // New Sections
        developerSection: "Developer",
        swapSection: "Swap",
        downloadsSection: "Downloads",
        developerContent: "Developer tools and resources will be available here.",
        swapContent: "Token swap functionality will be available here.",
        downloadsContent: "Download resources and tools will be available here.",
        
        // Tables Section
        dataTables: "Data Tables",
        searchPlaceholder: "Search data...",

        sortBy: "Sort by...",
        sortNameAsc: "Name (A-Z)",
        sortNameDesc: "Name (Z-A)",
        sortValueAsc: "Value (Low to High)",
        sortValueDesc: "Value (High to Low)",

        // Search Placeholders
        searchPlaceholderCash: "By Owner, CashID, Birth TxID, Spend TxID",
        searchPlaceholderTx: "By ID, Block TxID",
        searchPlaceholderOpReturn: "By text, signer, ID",
        searchPlaceholderBlock: "By height,ID",
        searchPlaceholderDetail: "Unavailable",
        searchPlaceholderCid: 'By CID, FID, used CIDs, pubkey',
        searchPlaceholderNid: 'By name, description, object ID, namer',
        searchPlaceholderMultisign: 'By FID, member, pubkey of member',
        searchPlaceholderProtocol: 'By owner, title, DID, or description',
        searchPlaceholderCode: 'By owner, name, DID, or description',
        searchPlaceholderService: 'By owner, name, description, or DID',
        searchPlaceholderApp: 'By owner, name, description, DID, SID, PID, or CodeId',
        searchPlaceholderTeam: "By owner, name, description, members, ID",
        searchPlaceholderGroup: "By name, description, members, ID",
        searchPlaceholderSecret: "By owner, ID",
        searchPlaceholderMail: "By Sender, Recipient, ID",
        searchPlaceholderStatement: "By publisher, title, content, ID",
        searchPlaceholderBox: "By owner, name, desc, ID",
        searchPlaceholderEssay: 'By publisher, title, DID, ID',
        searchPlaceholderReport: "By publisher, title, summary,author, DID,ID",
        searchPlaceholderPaper: 'By publisher, title, keywords, summary, author, DID, ID',
        searchPlaceholderBook: 'By publisher, title, summary,author, DID,ID',
        searchPlaceholderArtwork: 'By publisher, title, summary,author, DID,ID',
        searchPlaceholderRemark: 'By publisher, title, summary, author, DID, remarked Did, ID',
        searchPlaceholderProof: 'By issuer,owner,title,content,ID',
        searchPlaceholderTokenHolder: 'By holder, tokenId',
        searchPlaceholderContact: 'By Owner,ID',

        
        // Table Headers
        id: "ID",
        name: "Name", 
        value: "Value",
        category: "Category",
        date: "Date",
        
        // Pagination
        previous: "Previous",
        next: "Next",
        pageOf: "Page {0} of {1}",
        pageNumber: "Page {0}",
        
        // Categories
        electronics: "Electronics",
        clothing: "Clothing",
        books: "Books",
        home: "Home",
        sports: "Sports",
        
        // Sample Data
        productA: "Product A",
        productB: "Product B", 
        productC: "Product C",
        productD: "Product D",
        productE: "Product E",
        productF: "Product F",
        productG: "Product G",
        productH: "Product H",
        productI: "Product I",
        productJ: "Product J",
        
        // Footer
        copyright: "2025 No1_NrC7. Built with Freecash and Freeconsensus.",

        // Offline TX Page
        offlineTx: "Offline TX",
        sender: "Sender",
        confirm: "Search",
        spendCash: "Spend Cash",
        sendTo: "Send to",
        to: "To",
        amount: "Amount",
        add: "Add",
        carveText: "Carve text",
        rawTx: "Raw TX",
        clear: "Clear",
        copy: "Copy",
        create: "Create",
        loadMore: "Load More",
        noMoreData: "No More Data",
        added: "Added",
        inputError: "Input Error",
        error: "Error",
        noContentToCopy: "No content to copy",
        copiedToClipboard: "Copied to clipboard",
        failedToCopy: "Failed to copy",
        totalValue: "Total Value",
        totalCd: "Total CD",
        // Add placeholder translations
        enterSenderFid: "Enter sender FID, CID or part of them",
        enterFid: "Enter receiver FID, CID or part of them",
        enterAmount: "0.00",
        carveInputPlaceholder: "Input what you want to carve on chain",
        addMore: "More",

        // Broadcast TX Page
        broadcastTx: "Broadcast TX",
        result: "Result",
        broadcast: "Broadcast",
        enterRawTx: "Please enter raw transaction",
        invalidHexFormat: "Invalid hex format",
        broadcasting: "Broadcasting...",
        broadcastFailed: "Broadcast failed",
        decode: "Decode",
        decoding: "Decoding...",
        decodeFailed: "Decode failed",

        // Address Convert Page
        addressConvert: "Convert address",
        addressOrPubkey: "Address or pubkey",
        enterAddressOrPubkey: "Enter address or pubkey",
        convert: "Convert",
        converting: "Converting...",
        convertFailed: "Convert failed",

        // Encrypt Page
        encrypt: "Encrypt",
        encryptButton: "Encrypt",
        pubkey: "Pubkey",
        enterPubkey: "Enter pubkey, FID or part of them",
        plaintext: "Plaintext",
        enterPlaintext: "Enter text to encrypt",
        cipher: "Cipher",
        encrypting: "Encrypting...",
        encryptFailed: "Encrypt failed",

        // Verify Signature Page
        verifySignature: "Verify Signature",
        verifyButton: "Verify",
        signature: "Signature",
        enterSignature: "Enter signature to verify",
        verifying: "Verifying...",
        verifyFailed: "Verify failed"
    },
    
    zh: {
        // Header
        siteTitle: "自由宇宙",
        
        // Code Messages
        codeMessage: {
            code0: "成功。",
            code1000: "请求头中缺少签名。",
            code1001: "请求头中缺少公钥。",
            code1002: "请求头中缺少会话名称。",
            code1003: "缺少请求体。",
            code1004: "余额不足。请购买服务。",
            code1005: "请求URL与签名URL不一致。",
            code1006: "请求已过期。",
            code1007: "Nonce已被使用。",
            code1008: "签名验证失败。",
            code1009: "会话不存在或已过期。请重新登录。",
            code1010: "请求数据过多。",
            code1011: "没有符合条件的数据。",
            code1012: "查询错误。请参考文档检查请求体。",
            code1013: "请求错误。请检查请求体。",
            code1014: "API已暂停。",
            code1015: "请求头中缺少FID。",
            code1016: "非法URL。",
            code1017: "此API不支持该HTTP方法。",
            code1018: "缺少Nonce。",
            code1019: "缺少时间。",
            code1020: "其他错误。",
            code1021: "需要FID。",
            code1022: "方法不存在。",
            code1023: "缺少会话密钥。",
            code1024: "请求体中缺少URL。",
            code1025: "错误的SID。",
            code1026: "链上FCH余额不足。",
            code1027: "解析密文失败。",
            code1028: "使用私钥登录失败。",
            code1029: "解密失败。",
            code1030: "解析数据失败。",
            code1031: "缺少目标地址。",
            code1032: "操作不存在。",
            code1033: "缺少私钥。",
            code2001: "免费API当前不可用。",
            code2002: "未找到CID。",
            code2003: "非法FID。",
            code2004: "原始交易必须是十六进制格式。",
            code2005: "发送交易失败。",
            code2006: "未找到应用。",
            code2007: "未找到钞票。",
            code2008: "未找到服务。",
            code2009: "没有免费会话密钥。",
            code2010: "来自自由现金RPC的错误。",
            code2020: "写入数据失败。",
            code3001: "HTTP响应为空。",
            code3002: "GET请求失败。",
            code3003: "关闭HTTP客户端失败。",
            code3004: "请求URL缺失。",
            code3005: "响应体中的数据对象为空。",
            code3006: "响应状态错误。",
            code3007: "POST请求错误。",
            code3008: "GET请求错误。",
            code3009: "缺少DID。",
            code4001: "加密数据失败。",
            code4002: "算法不存在。",
            code4003: "提供者不存在。",
            code4004: "填充方式不存在。",
            code4005: "算法参数无效。",
            code4006: "密钥无效。",
            code4007: "解析十六进制失败。",
            code4008: "密钥长度错误。",
            code4009: "缺少IV。",
            code4010: "公钥和私钥必须来自不同的密钥对。",
            code4011: "校验和错误：sha256(symkey+iv+did)值的前4个字节。",
            code4012: "必须指定算法。",
            code4013: "密文错误。",
            code4014: "加密类型不存在。"
        },
        
        // Navigation
        home: "首页",
        tools: "工具", 
        developer: "开发者",
        swap: "兑换",
        downloads: "下载",

        // Developer Menu
        chainInfo: "链信息",
        nodeOfFCH: "FCH全节点",
        sdk: "SDK",
        api: "API",
        docs: "文档",

        sdkContent: "测试中，成熟后发布...",
        apiContent: "测试中，成熟后发布...",
        docsContent: "测试中，成熟后发布...",

        // Tools Menu Items
        myCash: "我的钞票",
        offlineTX: "离线交易",
        broadcastTX: "广播交易",
        addressConvert: "地址转换",
        encrypt: "加密",
        verifySignature: "验证签名",
    
        // My Cash Page
        myFid: "我的FID",
        qrCode: "二维码",
        createTx: "创建交易",

        // Description
        cashDescription: "中本聪框架的基本实体，被使用前也被称为UTXO",
        txDescription: "自由现金生态中花费钞票、发行新钞票的基础事务",
        opReturnDescription: "在自由现金区块链上刻4k字节以内的任何内容",
        blockDescription: "自由现金区块信息",
        cidDescription: "CID(Crypto Identity)是自由宇宙主体的身份",
        nidDescription: "NID (Named Identity) 是主体对客体ID的命名",
        nobodyDescription: "Nobody是已公开私钥的身份",
        multisignDescription: "由多个FID构成，需多个签名才能创建事务的主体身份",
        protocolDescription: "链上的开放协议市场",
        codeDescription: '链上的开放代码市场',
        secretDescription: "链上加密保存的个人秘密",
        mailDescription: "一定送达，永久保存的链上加密信件",
        serviceDescription: "链上的开放服务市场",
        appDescription: "链上的开放应用市场",
        groupDescription: "无管理的组织类型",
        teamDescription: "有管理的组织类型",
        boxDescription: "链上加密保存的个人容器",
        essayDescription: '链上发布一篇短文的DID',
        reportDescription: "链上发布一篇报告的DID",
        paperDescription: '链上发布一篇论文的DID',
        bookDescription: '链上发布一本书的DID',
        artworkDescription: '链上发布一件艺术品的DID',
        remarkDescription: '链上发布一篇评论的DID',
        proofDescription: '链上的凭据签发和管理系统',
        tokenDescription: '开放的代币发行系统',
        contactDescription: "永久加密保存在链上的联系人",
        
        // Field Names
        fieldNames: {
            id: "ID",
            owner: "所有者",
            valid: "可用",
            value: "金额",
            lastTime: "最新时间",
            lastHeight: "最新高度",
            cdd: "币天销毁",
            birthTime: "出生时间",
            birthIndex: "出生索引",
            type: "类型",
            lockScript: "锁定脚本",
            birthTxId: "出生交易ID",
            birthTxIndex: "出生交易索引",
            birthBlockId: "出生区块ID",
            birthHeight: "出生高度",
            spendTime: "花费时间",
            spendTxId: "花费交易ID",
            spendHeight: "花费高度",
            spendTxIndex: "花费交易索引",
            spendBlockId: "花费区块ID",
            spendIndex: "花费索引",
            unlockScript: "解锁脚本",
            sigHash: "签名哈希",
            sequence: "序列号",
            cd: "币天",
            cashDetail: "钞票详情",
            issuer: "发行者",
            txDetail: "交易详情",
            txIndex: "交易索引",
            blockId: "区块ID",
            lockTime: "锁定时间",
            fee: "手续费",
            version: "版本",
            signer: "签名者",
            sender: "发送人",
            recipient: "接收者",
            size: "大小",
            nonce: "随机数",
            bits: "难度",
            merkleRoot: "默克尔根",
            preId: "前一区块ID",
            opReturnId: "刻字ID",
            opReturn: "刻字",
            opReturnDetail: "刻字详情",
            txCount: "交易数",
            blockTime: "区块时间",
            outCount: "输出数",
            inCount: "输入数",
            inValueT: "输入金额",
            outValueT: "输出金额",
            height: "区块高度",
            cipherSend: "发送密文",
            cipherReci: "接收密文",
            textId: "文本ID",
            txIndex: "交易索引",
            blockId: "区块ID",
            time: "时间",
            cid: "CID",
            cidDetail: "CID详情",
            income: "收入",
            expend: "支出",
            usedCids: "曾用CID",
            pubkey: "公钥",
            isNobody: "是否明人",
            fid: "身份",
            homepage: "主页",
            guide: "向导",
            master: "人",
            balance: "余额",
            cash: "钞票",
            reputation: "声誉",
            hot: "热度",
            weight: "权重",
            noticeFee: "通知费",
            btcAddr: "比特币地址",
            ethAddr: "以太坊地址",
            ltcAddr: "莱特币地址",
            dogeAddr: "狗狗币地址",
            trxAddr: "波场地址",
            bchAddr: "比特币现金地址",
            nameTime: "命名时间",
            name: "名称",
            desc: "描述",
            oid: "对象ID",
            namer: "命名者",
            nidDetail: "NID详情",
            nobodyDetail: "明人详情",
            nobody: "Nobody",
            prikey: "私钥",
            leakTime: "泄露时间",
            leakHeight: "泄露高度",
            leakTxId: "泄露交易ID",
            leakTxIndex: "泄露交易索引",
            multisignDetail: "多重签名详情",
            required: "所需签名数",
            members: "成员数",
            fids: "成员FID",
            pubkeys: "成员公钥",
            redeemScript: "赎回脚本",
            // Protocol fields
            sn: '序列号',
            ver: '版本',
            did: 'DID',
            lang: '语言',
            prePid: '前协议ID',
            fileUrls: '文件URL',
            title: '标题',
            waiters: '客服',
            lastTxId: '最新交易ID',
            tRate: '总评分',
            active: '可用',
            closed: '已关闭',
            closeStatement: '关闭声明',
            // Code specific fields
            code: '代码',
            codeDetail: '代码详情',
            langs: '编程语言',
            urls: '链接',
            protocols: '协议',
            lastTxId: '最新交易ID',
            // Service specific fields
            stdName: '名称',
            localNames: '其他名称',
            types: '类型',
            urls: '网址',
            protocols: '协议',
            services: '服务',
            codes: '代码',
            params: '参数',
            serviceDetail: '服务详情',
            appDetail: '应用详情',
            downloads: '下载',
            groupDetail: '群详情',
            namers: '命名者',
            memberNum: '成员数量',
            cddToUpdate: '更新所需CDD',
            tCdd: '总CDD',
            teamDetail: "组详情",
            teamList: "组列表",
            box: "盒子",
            cipher: "密文",
            alg: "算法",
            boxDetail: "盒子详情",
            essayList: '短文列表',
            essayDetail: '短文详情',
            authors: '作者',
            publisher: '发布者',         
            summary: "摘要",
            paper: '论文',
            paperDetail: '论文详情',
            keywords: '关键词',
            artworkDetail: '艺术品详情',
            remark: '评论',
            remarkDetail: '评论详情',
            deleted: '已删除',
            onDid: '评论对象',
            proof: '凭据',
            proofDetail: '凭据详情',
            content: '内容',
            cosignersInvited: '受邀联署人',
            cosignersSigned: '已联署人',
            transferable: '可转让',
            destroyed: '已销毁',
            tokenHolder: '代币持有者',
            tokenHolderDetail: '代币持有者详情',
            tokenId: '代币ID',
            firstHeight: '首次高度',
            lastHeight: '最新高度',
            tokenDetail: '代币详情',
            deployer: '部署者',
            circulating: '流通量',
            closeable: '可关闭',
            openIssue: '开放铸币',
            maxAmtPerIssue: '单次最大发行量',
            minCddPerIssue: '单次最小CDD',
            maxIssuesPerAddr: '单地址最大发行量',
            decimal: '小数位',
            capacity: '容量',
            consensusId: '共识ID',
            closable: '可关闭',
            outValue: '发行金额',
            nid: 'NID',
            secretDetail: '秘密详情',
            mailDetail: '密信详情',
            contactList: '联系人列表',
            contactDetail: '联系人详情',
            decode: "解码",
            decoding: "正在解码...",
            decodeFailed: "解码失败",
            // Chain Info fields
            chainInfo: "链信息",
            totalSupply: "总发行量",
            difficulty: "难度",
            hashRate: "哈希率",
            chainSize: "链字节数",
            coinbaseMine: "每块挖矿产出",
            coinbaseFund: "每块基金产出",
            initialCoinbaseMine: "初始挖矿产出",
            initialCoinbaseFund: "初始基金产出",
            mineReductionRatio: "挖矿年衰减比例",
            fundReductionRatio: "基金年衰减比例",
            reducePerBlocks: "衰减间隔块数",
            reductionStopsAtHeight: "停止衰减的高度",
            stableAnnualIssuance: "稳定后年度发行量",
            mineMatureDays: "挖矿成熟天数",
            fundMatureDays: "基金成熟天数",
            daysPerYear: "每年天数",
            blockTimeMinute: "区块时间（分钟）",
            genesisBlockId: "创世区块ID",
            startTime: "开始时间",
            year: "当前年份",
            daysToNextYear: "到下一年的天数",
            heightOfNextYear: "下一年高度"
        },

        //Blockchain Section
        blockchain: "区块链",
        block: "区块",
        tx: "交易",
        cash: "钞票",
        opreturn: "刻字",

        // Identity Section
        identity: "身份",
        cid: "CID",
        nobody: "明人", 
        multisign: "多签",
        nid: "NID",
        
        // Construct Section
        construct: "设施",
        protocol: "协议",
        code: "代码",
        service: "服务",
        app: "应用",
        
        // Organization Section
        organization: "组织",
        group: "群",
        team: "组",
        
        // Personal Section
        personal: "个人",
        mail: "密信",
        contact: "联系人",
        secret: "秘密",
        alg: "算法",
        cipher: "密文",
        box: "盒子",
        
        // Publish Section
        publish: "发布",
        statement: "声明",
        essay: "短文",
        report: "报告",
        paper: "论文",
        book: "书籍",
        artwork: "艺术品",
        remark: "评论",
        
        // Business Section
        business: "商务",
        proof: "凭据",
        token: "代币",
        tokenHolder: "代币持有",
        
        // Charts Section
        dataVisualization: "数据可视化",
        toolsSection: "工具",
        lineChart: "折线图",
        barChart: "柱状图", 
        pieChart: "饼图",
        
        // New Sections
        developerSection: "开发者",
        swapSection: "交换",
        downloadsSection: "下载",
        developerContent: "开发者工具和资源将在此提供。",
        swapContent: "代币交换功能将在此提供。",
        downloadsContent: "下载资源和工具将在此提供。",
        
        // Tables Section
        dataTables: "数据表格",
        sortBy: "排序方式...",
        sortNameAsc: "名称 (A-Z)",
        sortNameDesc: "名称 (Z-A)",
        sortValueAsc: "数值 (从低到高)",
        sortValueDesc: "数值 (从高到低)",

        // Search Placeholders
        searchPlaceholderCash: "可搜所有者、CashID、发行交易ID、花费交易ID",
        searchPlaceholderTx: "可搜ID、区块交易ID",
        searchPlaceholderOpReturn: "可搜文本、签名者、ID",
        searchPlaceholderBlock: "可搜高度,ID",
        searchPlaceholderNid: '可搜名称、描述、对象ID、命名者',
        searchPlaceholderDetail: "不可用",
        searchPlaceholderCid: '可搜CID、FID、已用CID、公钥',
        searchPlaceholderMultisign: '可搜FID，成员，或成员公钥',
        searchPlaceholderProtocol: '可搜发布者，标题，DID，描述',
        searchPlaceholderCode: '可搜发布者，名称，DID，描述',
        searchPlaceholderService: '可搜发布者，名称，描述，或 DID',
        searchPlaceholderApp: '可搜发布者，名称，描述，DID, SID, PID, CodeId',
        searchPlaceholderTeam: "可搜所有者、名称、描述、成员数、ID",
        searchPlaceholderGroup: "可搜名称、描述、成员数、ID",
        searchPlaceholderSecret: "可搜所有者、ID",
        searchPlaceholderMail: "可搜发信人，收信人，ID",
        searchPlaceholderStatement: "可搜发布者、标题、内容、ID",
        searchPlaceholderBox: "可搜所有者，名称，描述，ID",
        searchPlaceholderEssay: '可搜发布者，标题，DID, ID',
        searchPlaceholderReport: "可搜发布者，标题，摘要，作者，DID,ID",
        searchPlaceholderPaper: '可搜发布者，标题，关键词，摘要，作者，DID,ID',
        searchPlaceholderBook: '可搜发布者，标题，摘要，作者，DID,ID',
        searchPlaceholderArtwork: '可搜发布者，标题，摘要，作者，DID,ID',
        searchPlaceholderRemark: '可搜发布者，标题，摘要，作者，DID, 被评DID，ID',
        searchPlaceholderProof: '可搜发行者，所有者，标题，内容,ID',
        searchPlaceholderTokenHolder: '可搜持有者，代币ID',
        searchPlaceholderContact: '可搜所有者，ID',

        
        // Table Headers
        id: "编号",
        name: "名称", 
        value: "数值",
        category: "类别",
        date: "日期",
        
        // Pagination
        previous: "上一页",
        next: "下一页",
        pageOf: "第 {0} 页，共 {1} 页",
        pageNumber: "第{0}页",
        
        
        // Footer
        copyright: "2025 No1_NrC7 基于自由现金和自由共识构建。",

        // Offline TX Page
        offlineTx: "离线交易",
        sender: "发送者",
        confirm: "搜索",
        spendCash: "选用钞票",
        sendTo: "支付",
        to: "付给",
        amount: "金额",
        add: "添加",
        carveText: "上链信息",
        rawTx: "待签名交易",
        clear: "清除",
        copy: "复制",
        create: "创建",
        loadMore: "更多",
        noMoreData: "无更多数据",
        added: "已添加",
        inputError: "输入错误",
        error: "错误",
        noContentToCopy: "没有内容可复制",
        copiedToClipboard: "已复制到剪贴板",
        failedToCopy: "复制失败",
        totalValue: "总金额",
        totalCd: "总币天",
        // Add placeholder translations
        enterSenderFid: "输入发送者FID、CID或其中一部分",
        enterFid: "输入接收者FID、CID或其中一部分",
        enterAmount: "0.00",
        carveInputPlaceholder: "输入上链信息",
        addMore: "更多",

        // Broadcast TX Page
        broadcastTx: "广播交易",
        result: "结果",
        broadcast: "广播",
        enterRawTx: "请输入原始交易",
        invalidHexFormat: "无效的十六进制格式",
        broadcasting: "正在广播...",
        broadcastFailed: "广播失败",
        decode: "解码",
        decoding: "正在解码...",
        decodeFailed: "解码失败",

        // Address Convert Page
        addressConvert: "地址转换",
        addressOrPubkey: "地址或公钥",
        enterAddressOrPubkey: "输入地址或公钥",
        convert: "转换",
        converting: "正在转换...",
        convertFailed: "转换失败",

        // Encrypt Page
        encrypt: "加密",
        encryptButton: "加密",
        pubkey: "公钥",
        enterPubkey: "输入公钥、FID或其中一部分",
        plaintext: "待加密文本",
        enterPlaintext: "输入要加密的文本",
        cipher: "密文",
        encrypting: "正在加密...",
        encryptFailed: "加密失败",

        // Verify Signature Page
        verifySignature: "验证签名",
        verifyButton: "验证",
        signature: "签名",
        enterSignature: "输入要验证的签名",
        verifying: "正在验证...",
        verifyFailed: "验证失败"
    },

};

// Expose strings to window object
window.strings = strings;

// Current language (default to English)
let currentLanguage = 'en';

// Initialize global data arrays
let currentData = [];
let filteredData = [];

// Function to get localized string
function getString(key) {
    // 优先使用 window.currentLanguage，如果没有则使用 currentLanguage
    const lang = window.currentLanguage || currentLanguage || 'en';
    return strings[lang]?.[key] || strings['en']?.[key] || key;
}

// Function to get localized string with parameters
function getStringWithParams(key, ...params) {
    let str = getString(key);
    params.forEach((param, index) => {
        str = str.replace(`{${index}}`, param);
    });
    return str;
}

// Function to switch language
function switchLanguage(lang) {
    if (strings[lang]) {
        currentLanguage = lang;
        updateAllStrings();
        // Save language preference
        localStorage.setItem('preferredLanguage', lang);
    }
}

// Function to load saved language preference
function loadLanguagePreference() {
    const savedLang = localStorage.getItem('preferredLanguage');
    if (savedLang && strings[savedLang]) {
        currentLanguage = savedLang;
        window.currentLanguage = savedLang;
    } else {
        // 如果没有保存的语言偏好，使用浏览器语言
        const browserLang = navigator.language || navigator.languages[0];
        const defaultLang = browserLang.toLowerCase().startsWith('zh') ? 'zh' : 'en';
        currentLanguage = defaultLang;
        window.currentLanguage = defaultLang;
        localStorage.setItem('preferredLanguage', defaultLang);
    }
}

// Function to update all strings in the DOM
function updateAllStrings() {
    // Update elements with data-string-key attributes
    document.querySelectorAll('[data-string-key]').forEach(element => {
        const key = element.getAttribute('data-string-key');
        if (key) {
            // Handle nested keys (e.g., "fieldNames.cashDetail")
            const keyParts = key.split('.');
            let value = window.strings[window.currentLanguage];
            for (const part of keyParts) {
                value = value?.[part];
            }
            if (value) {
                element.textContent = value;
            }
        }
    });

    // Update page title
    document.title = getString('siteTitle');
    
    // Update header
    const siteTitle = document.querySelector('header h1');
    if (siteTitle) siteTitle.textContent = getString('siteTitle');
    
    // Update navigation
    const navLinks = document.querySelectorAll('nav > ul > li > a[data-string-key]');
    navLinks.forEach(link => {
        const key = link.getAttribute('data-string-key');
        if (key && getString(key)) {
            link.textContent = getString(key);
        }
    });
    
    // Update section headers with new IDs
    const homeTitle = document.querySelector('#home h2');
    if (homeTitle) homeTitle.textContent = getString('blockchain');
    
    const toolsTitle = document.querySelector('#tools h2, #charts h2');
    if (toolsTitle) toolsTitle.textContent = getString('toolsSection');
    
    const developerTitle = document.querySelector('#developer h2');
    if (developerTitle) developerTitle.textContent = getString('developerSection');
    
    const swapTitle = document.querySelector('#swap h2');
    if (swapTitle) swapTitle.textContent = getString('swapSection');
    
    const downloadsTitle = document.querySelector('#downloads h2');
    if (downloadsTitle) downloadsTitle.textContent = getString('downloadsSection');
    
    const tablesTitle = document.querySelector('#tables h2');
    if (tablesTitle) tablesTitle.textContent = getString('dataTables');
    
    // Update Identity section
    const identityTitle = document.querySelector('#identity-title');
    if (identityTitle) identityTitle.textContent = getString('identity');
    
    // Update Construct section
    const constructTitle = document.querySelector('#construct-title');
    if (constructTitle) constructTitle.textContent = getString('construct');
    
    // Update Organization section
    const organizationTitle = document.querySelector('#organization-title');
    if (organizationTitle) organizationTitle.textContent = getString('organization');
    
    // Update Personal section
    const personalTitle = document.querySelector('#personal-title');
    if (personalTitle) personalTitle.textContent = getString('personal');
    
    // Update Publish section
    const publishTitle = document.querySelector('#publish-title');
    if (publishTitle) publishTitle.textContent = getString('publish');
    
    // Update Business section
    const businessTitle = document.querySelector('#business-title');
    if (businessTitle) businessTitle.textContent = getString('business');
    
    // Update section content
    const developerContent = document.querySelector('#developer p');
    if (developerContent) developerContent.textContent = getString('developerContent');
    
    const swapContent = document.querySelector('#swap p');
    if (swapContent) swapContent.textContent = getString('swapContent');
    
    const downloadsContent = document.querySelector('#downloads p');
    if (downloadsContent) downloadsContent.textContent = getString('downloadsContent');
    
    // Update stat cards with new blockchain terms
    const statCards = document.querySelectorAll('#home .section-container:nth-child(1) .stats-grid .stat-card h3');
    const statKeys = ['cash', 'tx', 'opreturn', 'block'];
    statCards.forEach((card, index) => {
        if (statKeys[index]) {
            const value = getString(statKeys[index]);
            card.textContent = value;
        }
    });
    
    // Update Identity stat cards
    const identityStatCards = document.querySelectorAll('#home .section-container:nth-child(2) .stats-grid .stat-card h3');
    const identityStatKeys = ['cid', 'nobody', 'multisign', 'nid'];
    identityStatCards.forEach((card, index) => {
        if (identityStatKeys[index]) {
            const value = getString(identityStatKeys[index]);
            card.textContent = value;
        }
    });
    
    // Update Construct stat cards
    const constructStatCards = document.querySelectorAll('#home .section-container:nth-child(3) .stats-grid .stat-card h3');
    const constructStatKeys = ['protocol', 'code', 'service', 'app'];
    constructStatCards.forEach((card, index) => {
        if (constructStatKeys[index]) {
            const value = getString(constructStatKeys[index]);
            card.textContent = value;
        }
    });
    
    // Update Organization stat cards
    const organizationStatCards = document.querySelectorAll('#home .section-container:nth-child(4) .stats-grid .stat-card h3');
    const organizationStatKeys = ['group', 'team'];
    organizationStatCards.forEach((card, index) => {
        if (organizationStatKeys[index]) {
            const value = getString(organizationStatKeys[index]);
            card.textContent = value;
        }
    });
    
    // Update Personal stat cards
    const personalStatCards = document.querySelectorAll('#home .section-container:nth-child(5) .stats-grid .stat-card h3');
    const personalStatKeys = ['mail', 'contact', 'secret', 'box'];
    personalStatCards.forEach((card, index) => {
        if (personalStatKeys[index]) {
            const value = getString(personalStatKeys[index]);
            card.textContent = value;
        }
    });
    
    // Update Publish stat cards
    const publishStatCards = document.querySelectorAll('#home .section-container:nth-child(6) .stats-grid .stat-card h3');
    const publishStatKeys = ['statement', 'essay', 'report', 'paper', 'book', 'artwork', 'remark'];
    publishStatCards.forEach((card, index) => {
        if (publishStatKeys[index]) {
            const value = getString(publishStatKeys[index]);
            card.textContent = value;
        }
    });
    
    // Update Business stat cards
    const businessStatCards = document.querySelectorAll('#home .section-container:nth-child(7) .stats-grid .stat-card h3');
    const businessStatKeys = ['proof', 'token', 'tokenHolder'];
    businessStatCards.forEach((card, index) => {
        if (businessStatKeys[index]) {
            const value = getString(businessStatKeys[index]);
            card.textContent = value;
        }
    });
    
    // Update chart buttons
    const chartButtons = document.querySelectorAll('.chart-btn');
    const chartKeys = ['lineChart', 'barChart', 'pieChart'];
    chartButtons.forEach((btn, index) => {
        if (chartKeys[index]) {
            btn.textContent = getString(chartKeys[index]);
        }
    });
    
    // Update table controls
    const searchInput = document.getElementById('search-input');
    if (searchInput) searchInput.placeholder = getString('searchPlaceholder');
    
    const mobileSearchInput = document.getElementById('mobile-search-input');
    if (mobileSearchInput) mobileSearchInput.placeholder = getString('searchPlaceholder');
    
    const desktopSearchInput = document.getElementById('desktop-search-input');
    if (desktopSearchInput) desktopSearchInput.placeholder = getString('searchPlaceholder');
    
    const sortOptions = document.querySelectorAll('#sort-select option');
    const sortKeys = ['sortBy', 'sortNameAsc', 'sortNameDesc', 'sortValueAsc', 'sortValueDesc'];
    sortOptions.forEach((option, index) => {
        if (sortKeys[index]) {
            option.textContent = getString(sortKeys[index]);
        }
    });
    
    // Update table headers
    const tableHeaders = document.querySelectorAll('#data-table th');
    const headerKeys = ['id', 'name', 'value', 'category', 'date'];
    tableHeaders.forEach((header, index) => {
        if (headerKeys[index]) {
            header.textContent = getString(headerKeys[index]);
        }
    });
    
    // Update pagination buttons
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    if (prevBtn) prevBtn.textContent = getString('previous');
    if (nextBtn) nextBtn.textContent = getString('next');
    
    // Update footer
    const footer = document.querySelector('footer p');
    if (footer) footer.textContent = getString('copyright');
    
    // Update data but don't re-render directly
    updateSampleData();
    
    // Instead of calling renderTable and updatePagination directly,
    // dispatch a custom event that our main script can listen for
    const event = new CustomEvent('stringsUpdated', {
        detail: { data: currentData }
    });
    document.dispatchEvent(event);
}

// Function to update sample data with localized strings
function updateSampleData() {
    const localizedData = [
        { id: 1, name: getString('productA'), value: 150, category: getString('electronics'), date: "2024-01-15" },
        { id: 2, name: getString('productB'), value: 320, category: getString('clothing'), date: "2024-01-16" },
        { id: 3, name: getString('productC'), value: 75, category: getString('books'), date: "2024-01-17" },
        { id: 4, name: getString('productD'), value: 450, category: getString('electronics'), date: "2024-01-18" },
        { id: 5, name: getString('productE'), value: 220, category: getString('home'), date: "2024-01-19" },
        { id: 6, name: getString('productF'), value: 180, category: getString('sports'), date: "2024-01-20" },
        { id: 7, name: getString('productG'), value: 95, category: getString('books'), date: "2024-01-21" },
        { id: 8, name: getString('productH'), value: 380, category: getString('electronics'), date: "2024-01-22" },
        { id: 9, name: getString('productI'), value: 165, category: getString('clothing'), date: "2024-01-23" },
        { id: 10, name: getString('productJ'), value: 290, category: getString('home'), date: "2024-01-24" }
    ];
    
    // Update global data arrays
    currentData = [...localizedData];
    filteredData = [...localizedData];
    
    return localizedData;
}

// Initialize language system
document.addEventListener('DOMContentLoaded', function() {
    loadLanguagePreference();
    // 不在这里立即调用 updateAllStrings，而是等待 Header.js 完成初始化
    // updateAllStrings();
}); 

// Add to each page's initialization code
window.addEventListener('load', function() {
    const savedLang = localStorage.getItem('preferredLanguage');
    if (savedLang && window.strings[savedLang]) {
        window.currentLanguage = savedLang;
        // 只有在 Header.js 没有处理的情况下才调用 updateAllStrings
        if (typeof window.updateAllStrings === 'function' && !window.Header) {
            window.updateAllStrings();
        }
    }
}); 

// 添加一个全局函数，供 Header.js 调用
window.initializeStrings = function() {
    loadLanguagePreference();
    updateAllStrings();
}; 