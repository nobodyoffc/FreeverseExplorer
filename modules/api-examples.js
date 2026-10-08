// /**
//  * API Usage Examples
//  * This file demonstrates how to use the server fallback API functionality
//  * Include this file after script.js to access these example functions
//  */

// // Example 1: Load blockchain statistics with fallback using URL_TAIL constants
// async function loadBlockchainStats() {
//     try {
//         const stats = await apiGet(URL_TAIL.TOTALS);
//         console.log('Blockchain stats loaded:', stats);
        
//         // Update UI with real data
//         if (stats.totalRecords) {
//             document.getElementById('total-records').textContent = stats.totalRecords;
//         }
//         if (stats.averageValue) {
//             document.getElementById('average-value').textContent = stats.averageValue;
//         }
        
//         return stats;
//     } catch (error) {
//         console.error('Failed to load blockchain stats:', error);
//         throw error;
//     }
// }

// // Example 2: Load identity data with custom headers using URL_TAIL
// async function loadIdentityData(authToken) {
//     try {
//         const identityStats = await apiGet(URL_TAIL.IDENTITY_STATS, {
//             'Authorization': `Bearer ${authToken}`,
//             'X-Client-Version': '1.0.0'
//         });
        
//         console.log('Identity data loaded:', identityStats);
        
//         // Update identity section
//         if (identityStats.cid) {
//             document.getElementById('cid-value').textContent = identityStats.cid;
//         }
//         if (identityStats.nobody) {
//             document.getElementById('nobody-value').textContent = identityStats.nobody;
//         }
        
//         return identityStats;
//     } catch (error) {
//         console.error('Failed to load identity data:', error);
//         throw error;
//     }
// }

// // Example 3: Submit new data with POST request using URL_TAIL
// async function submitNewRecord(recordData) {
//     try {
//         const result = await apiPost(URL_TAIL.RECORDS_CREATE, recordData);
//         console.log('Record submitted successfully:', result);
        
//         // Refresh the data after successful submission
//         await loadBlockchainStats();
        
//         return result;
//     } catch (error) {
//         console.error('Failed to submit record:', error);
//         throw error;
//     }
// }

// // Example 4: Update existing record with PUT request using URL_TAIL
// async function updateRecord(recordId, updateData) {
//     try {
//         const result = await apiPut(`${URL_TAIL.RECORDS_UPDATE}/${recordId}`, updateData);
//         console.log('Record updated successfully:', result);
        
//         // Refresh the data after successful update
//         await loadBlockchainStats();
        
//         return result;
//     } catch (error) {
//         console.error('Failed to update record:', error);
//         throw error;
//     }
// }

// // Example 5: Delete record with DELETE request using URL_TAIL
// async function deleteRecord(recordId) {
//     try {
//         const result = await apiDelete(`${URL_TAIL.RECORDS_DELETE}/${recordId}`);
//         console.log('Record deleted successfully:', result);
        
//         // Refresh the data after successful deletion
//         await loadBlockchainStats();
        
//         return result;
//     } catch (error) {
//         console.error('Failed to delete record:', error);
//         throw error;
//     }
// }

// // Example 6: Load multiple data types concurrently using URL_TAIL constants
// async function loadAllData() {
//     try {
//         console.log('Loading all data concurrently...');
        
//         const [totals, identityStats, constructStats, organizationStats] = await Promise.allSettled([
//             apiGet(URL_TAIL.TOTALS),
//             apiGet(URL_TAIL.IDENTITY_STATS),
//             apiGet(URL_TAIL.CONSTRUCT_STATS),
//             apiGet(URL_TAIL.ORGANIZATION_STATS)
//         ]);
        
//         // Handle successful responses
//         if (totals.status === 'fulfilled') {
//             console.log('Totals:', totals.value);
//             updateBlockchainUI(totals.value);
//         } else {
//             console.error('Totals failed:', totals.reason);
//         }
        
//         if (identityStats.status === 'fulfilled') {
//             console.log('Identity stats:', identityStats.value);
//             updateIdentityUI(identityStats.value);
//         } else {
//             console.error('Identity stats failed:', identityStats.reason);
//         }
        
//         if (constructStats.status === 'fulfilled') {
//             console.log('Construct stats:', constructStats.value);
//             updateConstructUI(constructStats.value);
//         } else {
//             console.error('Construct stats failed:', constructStats.reason);
//         }
        
//         if (organizationStats.status === 'fulfilled') {
//             console.log('Organization stats:', organizationStats.value);
//             updateOrganizationUI(organizationStats.value);
//         } else {
//             console.error('Organization stats failed:', organizationStats.reason);
//         }
        
//     } catch (error) {
//         console.error('Error in loadAllData:', error);
//     }
// }

// // Helper functions to update UI
// function updateBlockchainUI(data) {
//     if (data.totalRecords) document.getElementById('total-records').textContent = data.totalRecords;
//     if (data.averageValue) document.getElementById('average-value').textContent = data.averageValue;
//     if (data.maxValue) document.getElementById('max-value').textContent = data.maxValue;
//     if (data.minValue) document.getElementById('min-value').textContent = data.minValue;
// }

// function updateIdentityUI(data) {
//     if (data.cid) document.getElementById('cid-value').textContent = data.cid;
//     if (data.nobody) document.getElementById('nobody-value').textContent = data.nobody;
//     if (data.multisig) document.getElementById('multisig-value').textContent = data.multisig;
//     if (data.nid) document.getElementById('nid-value').textContent = data.nid;
// }

// function updateConstructUI(data) {
//     if (data.protocol) document.getElementById('protocol-value').textContent = data.protocol;
//     if (data.code) document.getElementById('code-value').textContent = data.code;
//     if (data.service) document.getElementById('service-value').textContent = data.service;
//     if (data.app) document.getElementById('app-value').textContent = data.app;
// }

// function updateOrganizationUI(data) {
//     if (data.square) document.getElementById('square-value').textContent = data.square;
//     if (data.team) document.getElementById('team-value').textContent = data.team;
// }

// // Example 7: Handle search with API using URL_TAIL constants
// async function performAPISearch(query) {
//     try {
//         console.log(`Searching for: ${query}`);
        
//         const searchResults = await apiPost(URL_TAIL.SEARCH, {
//             query: query,
//             limit: 50,
//             offset: 0
//         });
        
//         console.log('Search results:', searchResults);
        
//         // Update the current data with search results
//         if (searchResults.data && Array.isArray(searchResults.data)) {
//             currentData = searchResults.data;
//             filteredData = [...currentData];
            
//             // Update UI
//             renderTable();
//             updatePagination();
//         }
        
//         return searchResults;
//     } catch (error) {
//         console.error('API search failed:', error);
//         // Fallback to local search
//         handleSearch();
//     }
// }

// // Example 8: API health check using URL_TAIL
// async function checkAPIHealth() {
//     try {
//         console.log('Checking API health...');
//         const healthStatus = await apiGet(URL_TAIL.HEALTH_CHECK);
//         console.log('API health status:', healthStatus);
//         return healthStatus;
//     } catch (error) {
//         console.error('API health check failed:', error);
//         throw error;
//     }
// }

// // Example 9: Get API version information using URL_TAIL
// async function getAPIVersion() {
//     try {
//         console.log('Getting API version...');
//         const versionInfo = await apiGet(URL_TAIL.VERSION);
//         console.log('API version:', versionInfo);
//         return versionInfo;
//     } catch (error) {
//         console.error('Failed to get API version:', error);
//         throw error;
//     }
// }

// // Example 10: User authentication using URL_TAIL
// async function authenticateUser(credentials) {
//     try {
//         console.log('Authenticating user...');
//         const authResult = await apiPost(URL_TAIL.USER_AUTH, credentials);
//         console.log('Authentication successful:', authResult);
//         return authResult;
//     } catch (error) {
//         console.error('Authentication failed:', error);
//         throw error;
//     }
// }

// // Example 11: Get user information using URL_TAIL
// async function getUserInfo(authToken) {
//     try {
//         console.log('Getting user info...');
//         const userInfo = await apiGet(URL_TAIL.USER_INFO, {
//             'Authorization': `Bearer ${authToken}`
//         });
//         console.log('User info:', userInfo);
//         return userInfo;
//     } catch (error) {
//         console.error('Failed to get user info:', error);
//         throw error;
//     }
// }

// // Example 12: Search by category using URL_TAIL
// async function searchByCategory(category, limit = 20, offset = 0) {
//     try {
//         console.log(`Searching by category: ${category}`);
//         const results = await apiPost(URL_TAIL.SEARCH_BY_CATEGORY, {
//             category: category,
//             limit: limit,
//             offset: offset
//         });
//         console.log('Category search results:', results);
//         return results;
//     } catch (error) {
//         console.error('Category search failed:', error);
//         throw error;
//     }
// }

// // Example 13: Search by ID using URL_TAIL
// async function searchById(id) {
//     try {
//         console.log(`Searching by ID: ${id}`);
//         const result = await apiGet(`${URL_TAIL.SEARCH_BY_ID}/${id}`);
//         console.log('ID search result:', result);
//         return result;
//     } catch (error) {
//         console.error('ID search failed:', error);
//         throw error;
//     }
// }

// // Example 14: Periodic data refresh with error handling
// function startPeriodicDataRefresh(intervalMs = 60000) { // Default: 1 minute
//     console.log(`Starting periodic data refresh every ${intervalMs}ms`);
    
//     const refreshInterval = setInterval(async () => {
//         try {
//             console.log('Refreshing data...');
//             await loadAllData();
//             console.log('Data refresh completed');
//         } catch (error) {
//             console.error('Periodic refresh failed:', error);
//             // Could implement exponential backoff here if needed
//         }
//     }, intervalMs);
    
//     // Return function to stop the refresh
//     return () => {
//         console.log('Stopping periodic data refresh');
//         clearInterval(refreshInterval);
//     };
// }

// // Example 15: Batch operations with URL_TAIL constants
// async function performBatchOperations(operations) {
//     const results = [];
    
//     for (const [index, operation] of operations.entries()) {
//         try {
//             console.log(`Performing operation ${index + 1}/${operations.length}`);
            
//             let result;
//             switch (operation.type) {
//                 case 'GET':
//                     result = await apiGet(operation.endpoint, operation.headers);
//                     break;
//                 case 'POST':
//                     result = await apiPost(operation.endpoint, operation.data, operation.headers);
//                     break;
//                 case 'PUT':
//                     result = await apiPut(operation.endpoint, operation.data, operation.headers);
//                     break;
//                 case 'DELETE':
//                     result = await apiDelete(operation.endpoint, operation.headers);
//                     break;
//                 default:
//                     throw new Error(`Unknown operation type: ${operation.type}`);
//             }
            
//             results.push({ success: true, data: result, operation });
//             console.log(`✅ Operation ${index + 1} completed successfully`);
            
//         } catch (error) {
//             console.error(`❌ Operation ${index + 1} failed:`, error);
//             results.push({ success: false, error: error.message, operation });
//         }
        
//         // Optional delay between operations
//         if (index < operations.length - 1 && operation.delay) {
//             await sleep(operation.delay);
//         }
//     }
    
//     return results;
// }

// // Example usage with the new URL_TAIL constants:
// /*

// // Initialize with API data
// document.addEventListener('DOMContentLoaded', function() {
//     setTimeout(async () => {
//         try {
//             // Check API health first
//             await checkAPIHealth();
            
//             // Get API version
//             const version = await getAPIVersion();
//             console.log('Using API version:', version);
            
//             // Load all data when page loads
//             await loadAllData();
            
//             // Show which server is working
//             const workingServer = getWorkingServer();
//             console.log('Current working server:', workingServer);
            
//             // Start periodic refresh (optional)
//             const stopRefresh = startPeriodicDataRefresh(30000); // Every 30 seconds
            
//             // Example: Stop refresh after 5 minutes
//             setTimeout(stopRefresh, 5 * 60 * 1000);
            
//         } catch (error) {
//             console.error('Failed to initialize with API data:', error);
//         }
//     }, 500);
// });

// // Example: Server management functions
// async function demonstrateServerManagement() {
//     console.log('=== Server Management Demo ===');
    
//     // Check current working server
//     console.log('Current working server:', getWorkingServer());
    
//     // Test all servers individually
//     console.log('Testing all servers...');
//     for (const server of SERVER_URL_HEADS) {
//         const isAvailable = await testServer(server);
//         console.log(`Server ${server}: ${isAvailable ? 'Available' : 'Unavailable'}`);
//     }
    
//     // Reset working server to force re-discovery
//     resetWorkingServer();
    
//     // Make a request (will discover new working server)
//     try {
//         await loadBlockchainStats();
//         console.log('New working server after reset:', getWorkingServer());
//     } catch (error) {
//         console.error('Failed to discover working server:', error);
//     }
    
//     // Manually set a specific server
//     resetWorkingServer('https://cid.cash/APIP');
//     console.log('Manually set working server:', getWorkingServer());
// }

// // Example: Monitor server health
// async function monitorServerHealth() {
//     console.log('=== Server Health Monitoring ===');
    
//     setInterval(async () => {
//         const currentServer = getWorkingServer();
        
//         if (currentServer) {
//             console.log(`Checking health of working server: ${currentServer}`);
//             const isHealthy = await testServer(currentServer);
            
//             if (!isHealthy) {
//                 console.warn('Working server is unhealthy, resetting...');
//                 resetWorkingServer();
//             } else {
//                 console.log('Working server is healthy ✅');
//             }
//         } else {
//             console.log('No working server set, will auto-discover on next request');
//         }
//     }, 60000); // Check every minute
// }

// // Example batch operations using URL_TAIL constants
// const batchOps = [
//     { type: 'GET', endpoint: URL_TAIL.TOTALS },
//     { type: 'GET', endpoint: URL_TAIL.IDENTITY_STATS },
//     { type: 'POST', endpoint: URL_TAIL.RECORDS_CREATE, data: { name: 'Test', value: 100 } },
//     { type: 'GET', endpoint: URL_TAIL.RECORDS, delay: 1000 } // 1 second delay after this
// ];

// performBatchOperations(batchOps).then(results => {
//     console.log('Batch operations completed:', results);
//     console.log('Working server after batch operations:', getWorkingServer());
// });

// // Example authentication flow
// async function loginUser(username, password) {
//     try {
//         const authResult = await authenticateUser({ username, password });
//         const userInfo = await getUserInfo(authResult.token);
//         console.log('Login successful, user info:', userInfo);
//         return { auth: authResult, user: userInfo };
//     } catch (error) {
//         console.error('Login failed:', error);
//         throw error;
//     }
// }

// // Example search operations
// async function performAdvancedSearch() {
//     try {
//         // Search by different criteria
//         const generalSearch = await performAPISearch('blockchain');
//         const categorySearch = await searchByCategory('Electronics');
//         const idSearch = await searchById(123);
        
//         console.log('Search results:', {
//             general: generalSearch,
//             category: categorySearch,
//             byId: idSearch
//         });
        
//         console.log('Working server after search operations:', getWorkingServer());
//     } catch (error) {
//         console.error('Advanced search failed:', error);
//     }
// }

// */ 