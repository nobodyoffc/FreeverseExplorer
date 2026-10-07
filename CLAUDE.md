# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is **Freeverse**, a blockchain explorer and data visualization web application for the Freecash blockchain. It's a client-side web application deployed in a Tomcat server environment that provides interfaces to explore blockchain data including transactions, blocks, addresses (CIDs), protocols, services, tokens, and various on-chain entities.

The application is built with vanilla JavaScript (ES6 modules), HTML, and CSS with no build system - all code runs directly in the browser.

## Architecture

### Core API System

**API Failover Architecture** (`modules/api.js`):
- Multi-server failover system with automatic retry logic
- Server list: `SERVER_URL_HEADS` array defines fallback servers
- Working server tracking: `workingServerUrlHead` caches the current working server
- Request flow: Try working server → fallback through server list → retry mechanism
- Timeout and retry configuration in `API_CONFIG`

**Key API Functions**:
- `apiRequest(endpoint, options)` - Core request handler with failover
- `apiGet()`, `apiPost()`, `apiPut()`, `apiDelete()` - Convenience wrappers
- `testServer(serverUrlHead, endpoint)` - Test server availability
- `URL_TAIL` object contains all API endpoint paths organized by service number (sn)

### Entity System

**Entity Classes** (`entity/` directory):
All entity classes follow a consistent pattern with static methods:
- `fromMap(map)` - Construct entity from API response object
- `getFieldWidthMap()` - Define display widths for table columns
- `getTimestampFieldList()` - Fields to convert to timestamps
- `getSatoshiFieldList()` - Fields to display as cryptocurrency amounts
- `getShowFieldNameAsMap()` - Localized field name mapping
- `getReplaceWithMeFieldList()` - Fields that can be filtered by user's identity

**Key Entities**:
- Blockchain: `Cash`, `Tx`, `Block`, `OpReturn`, `ChainInfo`
- Identity: `Cid`, `Nid`, `Nobody`, `Multisig`
- Construct: `Protocol`, `Code`, `Service`, `App`
- Organization: `Group`, `Team`
- Personal: `Mail`, `Contact`, `Secret`, `Box`
- Publishing: `Statement`, `Essay`, `Report`, `Paper`, `Book`, `Artwork`, `Remark`
- Business: `Proof`, `Token`, `TokenHolder`

### Internationalization (i18n)

**Language System** (`constants/strings.js`):
- All UI text stored in `strings` object with `en` and `zh` language keys
- Browser language detection with fallback to English
- localStorage persistence: `preferredLanguage` key
- Central string access: `getString(key)` function
- Field name localization through `fieldNames` nested object

**Language Management**:
- `Header.js` controls language switching globally
- Language changes trigger `languageChanged` event
- All pages listen for this event and update their UI
- Each module implements `updateStrings()` method for localized content

### Module System

**Page Modules** (`modules/` directory):
Each page has a corresponding module (e.g., `cash-list.js`, `tx-detail.js`) that:
1. Initializes page-specific UI and event listeners
2. Fetches data from API endpoints
3. Renders data in tables or detail views
4. Handles search, pagination, and filtering
5. Responds to language change events

**Common Modules**:
- `Header.js` - Global header with navigation, search, and language switching
- `LoadingOverlay.js` - Global loading indicator
- `utils.js` - Shared utilities (error handling, toasts, QR codes)
- `search-config.js` - Search placeholder management per page
- `api.js` - API client with failover logic

### Search System

**Smart Search** (implemented in `Header.js`):
Homepage search has special logic:
- Integer input → redirect to block detail by height
- 64-character hex → detect entity type (tx/cash/block/cid) via API calls
- Other input → redirect to CID list with search parameter

**Page-Specific Search**:
Each list page implements its own search through API query parameters using the search endpoint pattern:
- `{entity}Search` endpoints for filtered queries
- Search parameters defined in `modules/search-config.js`
- Placeholders localized per page type

### State Management

**Global State**:
- `window.currentLanguage` - Current UI language
- `window.API` - API client singleton
- `window.avatarCacheManager` - Avatar cache with 10-minute TTL
- `window.strings` - i18n string dictionary

**Per-Page State**:
- List pages: current page number, filtered data, sort order
- Detail pages: entity ID from URL parameters, loaded entity data
- Search state maintained through URL parameters

### Styling Patterns

**CSS Organization**:
- `css/styles.css` - Global styles and layout
- Page-specific CSS files (e.g., `css/myCash.css`, `css/broadcastTx.css`)
- Mobile-first responsive design with breakpoints at 600px and 900px
- Common patterns: `.section-container`, `.stats-grid`, `.stat-card`

## Development Workflow

### Running the Application

This is a Tomcat-deployed application:
```bash
# Application root (current directory):
/Users/liuchangyong/tomcat-9.0.73/webapps/ROOT

# To test locally, use a web server from this directory:
# Option 1: Python
python3 -m http.server 8000

# Option 2: Node.js
npx http-server -p 8000

# Then open http://localhost:8000
```

### Adding New Entity Types

When adding a new entity type (e.g., a new on-chain protocol):

1. **Create Entity Class** (`entity/NewEntity.js`):
   - Extend the standard entity pattern with required static methods
   - Import field name constants from `constants/fieldNames.js`
   - Implement field mapping and localization

2. **Add i18n Strings** (`constants/strings.js`):
   - Add entity name in both `en` and `zh` sections
   - Add search placeholder
   - Add description text
   - Add field-specific translations

3. **Create List Page** (`html/newentity-list.html`, `modules/newentity-list.js`):
   - Follow existing list page pattern (e.g., `cash-list.html`)
   - Implement search, pagination, and filtering
   - Add language change listener

4. **Create Detail Page** (`html/newentity-detail.html`, `modules/newentity-detail.js`):
   - Follow existing detail page pattern (e.g., `cash-detail.html`)
   - Extract entity ID from URL parameters
   - Display entity data in readable format

5. **Add to Navigation**:
   - Update appropriate section in `index.html`
   - Add navigation link in `Header.js` if needed
   - Update search configuration in `modules/search-config.js`

### API Integration

**Endpoint Naming Convention**:
API endpoints follow pattern: `/APIP/sn{N}/v1/{operation}`
- `sn{N}` - Service number (groups related endpoints)
- Operations: `{entity}Search`, `{entity}ByIds`, etc.

**Adding New Endpoints**:
1. Add endpoint path to `URL_TAIL` object in `modules/api.js`
2. Use `apiGet()` or `apiPost()` to call the endpoint
3. Handle response with `handleApiResponse()` from `utils.js`
4. Error messages automatically localized via `strings.codeMessage`

### Error Handling

**Standard Error Flow**:
1. API errors caught in `handleApiResponse()`
2. Error code mapped to localized message via `strings.{lang}.codeMessage.code{N}`
3. Toast notification displayed with `showToast(message, 'error')`
4. Display function called with empty data to clear UI

**Custom Error Handling**:
```javascript
try {
    const data = await window.API.apiGet(endpoint);
    await handleApiResponse(data, displayFunction, params);
} catch (error) {
    showToast(getString('error'), 'error');
    displayFunction([], params); // Clear display
}
```

## Key Concepts

### CID (Crypto Identity)
The fundamental identity unit in Freecash. Every FID (Freecash address) has associated CID data including pubkey, balance, reputation, avatars, and cross-chain addresses.

### OpReturn
On-chain data storage mechanism - up to 4KB of arbitrary data can be "carved" into the blockchain via OP_RETURN outputs.

### Entity Lifecycle
Most entities have these common fields:
- `birthTime`/`birthHeight` - When created on-chain
- `lastTime`/`lastHeight` - Most recent update
- `owner` - Controlling FID
- `active`/`closed` - Current status

### Avatar Caching
Avatars are cached globally via `AvatarCacheManager`:
- 10-minute cache duration
- Batch fetching to reduce API calls
- Separate cache for CID avatars (`fetchCidAvatars`)

## Important Files

- `index.html` - Homepage with statistics and navigation
- `modules/api.js` - API client with failover logic
- `modules/Header.js` - Global navigation and search
- `constants/strings.js` - All UI text in English and Chinese
- `constants/fieldNames.js` - Field name constants for entities
- `modules/utils.js` - Shared utilities (toasts, QR codes, HTML escaping)

## Common Tasks

**Adding i18n Support to New Text**:
1. Add key-value pair to both `en` and `zh` in `constants/strings.js`
2. Use `getString(key)` to access in JavaScript
3. Use `data-string-key` attribute for automatic DOM updates

**Creating a New Tool Page**:
1. Copy an existing tool page (e.g., `html/encrypt.html`)
2. Create module file in `modules/`
3. Add to Tools dropdown in `Header.js` menu items
4. Add i18n strings for all UI text

**Debugging API Issues**:
1. Check browser console for server test logs (`🔍`, `✅`, `❌` prefixes)
2. Verify `window.API.getWorkingServer()` returns expected server
3. Use `window.API.testServer(url)` to manually test servers
4. Check `API_CONFIG.timeout` and `retryAttempts` if requests timing out

## Notes

- No build step required - all JavaScript is ES6 modules loaded directly
- Mobile-first responsive design - test at 600px and 900px breakpoints
- All times are Unix timestamps (seconds) - convert for display
- All amounts in satoshis (1 FCH = 100,000,000 satoshis)
- QR code generation uses external library loaded dynamically
- Field names use snake_case in API, camelCase in JavaScript
