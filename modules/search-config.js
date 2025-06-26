// Search configuration for different pages
const searchConfig = {
    // Default configuration
    default: {
        placeholder: 'searchPlaceholder',
        searchableFields: ['name', 'id'],
        enabled: true,
        disabledPlaceholder: 'searchPlaceholderDetail'  // Use detail placeholder when disabled
    },
    
    // Page specific configurations
    pages: {
        'cash-list': {
            placeholder: 'searchPlaceholderCash',
            searchableFields: ['owner', 'id','birthTxId','spendTxId'],
            enabled: true,
            disabledPlaceholder: 'searchPlaceholderDetail'
        },
        'tx-list': {
            placeholder: 'searchPlaceholderTx',
            searchableFields: ['id', 'blockId'],
            enabled: true,
            disabledPlaceholder: 'searchPlaceholderDetail'
        },
        'block-list': {
            placeholder: 'searchPlaceholderBlock',
            searchableFields: ['height', 'id'],
            enabled: true,
            disabledPlaceholder: 'searchPlaceholderDetail'
        },
        'opreturn-list': {
            placeholder: 'searchPlaceholderOpReturn',
            searchableFields: ['opReturn', 'signer', 'id'],
            enabled: true,
            disabledPlaceholder: 'searchPlaceholderDetail'
        },
        'cid-list': {
            placeholder: 'searchPlaceholderCid',
            searchableFields: ['id', 'usedCids', 'pubkey'],
            enabled: true,
            disabledPlaceholder: 'searchPlaceholderDetail'
        },
        'detail-list': {
            placeholder: 'searchPlaceholderDetail',
            searchableFields: [],
            enabled: false,
            disabledPlaceholder: 'searchPlaceholderDetail'  // Same as placeholder since it's always disabled
        },
        'nid-list': {
            placeholder: 'searchPlaceholderNid',
            searchableFields: ['name', 'desc', 'oid', 'namer', 'id'],
            enabled: true,
            disabledPlaceholder: 'searchPlaceholderDetail'
        },
        'nobody-list': {
            placeholder: 'searchPlaceholderNobody',
            searchableFields: ['id', 'prikey'],
            enabled: true,
            disabledPlaceholder: 'searchPlaceholderDetail'
        },
        'multisign-list': {
            placeholder: 'searchPlaceholderMultisign',
            searchableFields: ['id', 'fids', 'pubkeys'],
            enabled: true,
            disabledPlaceholder: 'searchPlaceholderDetail'
        },
        'protocol-list': {
            placeholder: 'searchPlaceholderProtocol',
            searchableFields: ['owner', 'title', 'did', 'desc', 'id'],
            enabled: true,
            disabledPlaceholder: 'searchPlaceholderDetail'
        },
        'code-list': {
            placeholder: 'searchPlaceholderCode',
            searchableFields: ['owner', 'name', 'did', 'desc', 'id'],
            enabled: true,
            disabledPlaceholder: 'searchPlaceholderDetail'
        },
        'service-list': {
            placeholder: 'searchPlaceholderService',
            searchableFields: ['owner', 'stdName', 'localNames', 'did', 'desc', 'id'],
            enabled: true,
            disabledPlaceholder: 'searchPlaceholderDetail'
        },
        'app-list': {
            placeholder: 'searchPlaceholderApp',
            searchableFields: ['owner', 'stdName', 'localNames', 'services', 'protocols', 'codes', 'did', 'desc', 'id'],
            enabled: true,
            disabledPlaceholder: 'searchPlaceholderDetail'
        },
        'group-list': {
            placeholder: 'searchPlaceholderGroup',
            searchableFields: ['name','desc', 'members', 'id'],
            enabled: true,
            disabledPlaceholder: 'searchPlaceholderDetail'
        },
        'team-list': {
            placeholder: 'searchPlaceholderTeam',
            searchableFields: ['owner', 'stdName', 'localNames','members', 'desc', 'id'],
            enabled: true,
            disabledPlaceholder: 'searchPlaceholderDetail'
        },
        'secret-list': {
            placeholder: 'searchPlaceholderSecret',
            searchableFields: ['owner', 'id'],
            enabled: true,
            disabledPlaceholder: 'searchPlaceholderDetail'
        },
        'statement-list': {
            placeholder: 'searchPlaceholderStatement',
            searchableFields: ['publisher', 'title', 'content', 'id'],
            enabled: true,
            disabledPlaceholder: 'searchPlaceholderDetail'
        },
        'box-list': {
            placeholder: 'searchPlaceholderBox',
            searchableFields: ['owner', 'name', 'desc', 'id'],
            enabled: true,
            disabledPlaceholder: 'searchPlaceholderDetail'
        },
        'essay-list': {
            placeholder: 'searchPlaceholderEssay',
            searchableFields: ['publisher', 'title', 'id', 'did'],
            enabled: true,
            disabledPlaceholder: 'searchPlaceholderDetail'
        },
        'report-list': {
            placeholder: 'searchPlaceholderReport',
            searchableFields: ['publisher', 'title', 'summary', 'authors', 'did', 'id'],
            enabled: true,
            disabledPlaceholder: 'searchPlaceholderDetail'
        },
        'paper-list': {
            placeholder: 'searchPlaceholderPaper',
            searchableFields: ['publisher', 'title', 'keywords', 'summary', 'authors', 'did', 'id'],
            enabled: true,
            disabledPlaceholder: 'searchPlaceholderDetail'
        },
        'book-list': {
            placeholder: 'searchPlaceholderBook',
            searchableFields: ['publisher', 'title', 'summary', 'authors', 'did', 'id'],
            enabled: true,
            disabledPlaceholder: 'searchPlaceholderDetail'
        },
        'artwork-list': {
            placeholder: 'searchPlaceholderArtwork',
            searchableFields: ['publisher', 'title', 'summary', 'authors', 'did', 'id'],
            enabled: true,
            disabledPlaceholder: 'searchPlaceholderDetail'
        },
        'remark-list': {
            placeholder: 'searchPlaceholderRemark',
            searchableFields: ['publisher', 'title', 'summary', 'authors', 'did', 'onDid', 'id'],
            enabled: true,
            disabledPlaceholder: 'searchPlaceholderDetail'
        },
        'proof-list': {
            placeholder: 'searchPlaceholderProof',
            searchableFields: ['issuer', 'owner', 'title', 'content', 'id'],
            enabled: true,
            disabledPlaceholder: 'searchPlaceholderDetail'
        },
        'tokenHolder-list': {
            placeholder: 'searchPlaceholderTokenHolder',
            searchableFields: ['fid', 'tokenId', 'id'],
            enabled: true,
            disabledPlaceholder: 'searchPlaceholderDetail'
        },
        'token-list': {
            placeholder: 'searchPlaceholderToken',
            searchableFields: ['name', 'deployer', 'desc', 'id'],
            enabled: true,
            disabledPlaceholder: 'searchPlaceholderDetail'
        },
        'mail-list': {
            placeholder: 'searchPlaceholderMail',
            searchableFields: ['sender', 'recipient', 'id'],
            enabled: true,
            disabledPlaceholder: 'searchPlaceholderDetail'
        },
        'contact-list': {
            placeholder: 'searchPlaceholderContact',
            searchableFields: ['owner', 'id'],
            enabled: true,
            disabledPlaceholder: 'searchPlaceholderDetail'
        }
    }
};

// Get search configuration for current page
function getSearchConfig() {
    const path = window.location.pathname;
    
    // Find matching page configuration
    for (const [pageKey, config] of Object.entries(searchConfig.pages)) {
        if (path.includes(pageKey)) {
            return config;
        }
    }
    
    // Return default configuration if no match found
    return searchConfig.default;
}

// Update search inputs with configuration
function updateSearchInputs(strings) {
    const config = getSearchConfig();
    const searchInputs = document.querySelectorAll('#desktop-search-input, #mobile-search-input');
    const searchContainers = document.querySelectorAll('.desktop-search-container, .mobile-search-container');
    
    // Check if search should be disabled for this page
    const shouldDisableSearch = document.body.hasAttribute('data-disable-header-search');
    
    searchInputs.forEach((input, index) => {
        const container = searchContainers[index];
        
        if (config.enabled && !shouldDisableSearch) {
            // Update placeholder
            input.placeholder = strings[config.placeholder] || strings.searchPlaceholder || 'Search...';
            
            // Add data attribute for searchable fields
            input.dataset.searchableFields = config.searchableFields.join(',');
            
            // Enable search
            input.disabled = false;
            input.style.opacity = '1';
            container.style.display = 'flex';
        } else {
            // Disable search and set disabled placeholder
            input.disabled = true;
            input.style.opacity = '0.5';
            container.style.display = 'none';
            input.placeholder = strings[config.disabledPlaceholder] || 'Unavailable';
        }
    });
}

export { getSearchConfig, updateSearchInputs }; 