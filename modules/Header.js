import { updateSearchInputs } from './search-config.js';

class Header {
    static getDefaultLanguage() {
        // First try to get saved preference
        const savedLang = localStorage.getItem('preferredLanguage');
        if (savedLang) {
            return savedLang;
        }

        // Get browser language
        const browserLang = navigator.language || navigator.languages[0];
        
        // Check if browser language is Chinese (zh or zh-CN or zh-TW)
        if (browserLang.toLowerCase().startsWith('zh')) {
            return 'zh';
        }
        
        // Default to English for all other languages
        return 'en';
    }

    static getString(key) {
        const currentLang = window.currentLanguage || this.getDefaultLanguage();
        const strings = window.strings?.[currentLang] || window.strings?.['en'];
        const result = strings?.[key] || key;
        
        return result;
    }

    static async init() {
        // Mark Header as loaded to prevent conflicts with other initialization
        window.Header = true;
        
        // Load header template
        const response = await fetch('/html/header.html');
        const headerHtml = await response.text();
        
        // Insert header into all pages
        document.body.insertAdjacentHTML('afterbegin', headerHtml);
        
        // Set initial language and update all strings first
        if (typeof window.strings !== 'undefined') {
            // Get default language based on browser settings or saved preference
            const defaultLang = this.getDefaultLanguage();
            window.currentLanguage = defaultLang;
            
            // Update UI to reflect current language
            this.updateLanguageUI(defaultLang);
            
            // Initialize strings system and update all strings in the DOM
            if (typeof window.initializeStrings === 'function') {
                window.initializeStrings();
            } else {
                this.updateAllStrings();
            }
        }
        
        // Initialize header functionality after strings are set
        this.initLanguageSwitcher();
        this.initSearch();
        this.initMobileMenu();
        this.initDeveloperMenu();
        this.initToolsMenu();

        // Add visibility change listener to handle page visibility changes
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
                const savedLang = localStorage.getItem('preferredLanguage');
                if (savedLang && window.strings[savedLang]) {
                    this.updateLanguage(savedLang);
                }
            }
        });

        // Add pageshow event listener to handle back/forward navigation
        window.addEventListener('pageshow', (event) => {
            if (event.persisted) {
                const savedLang = localStorage.getItem('preferredLanguage');
                if (savedLang && window.strings[savedLang]) {
                    this.updateLanguage(savedLang);
                }
            }
        });

        // Add window resize listener to handle responsive dropdown positioning
        window.addEventListener('resize', () => {
            // Re-initialize dropdowns when screen size changes significantly
            const currentWidth = window.innerWidth;
            const isMobile = currentWidth <= 600;
            
            // Check if we need to reinitialize dropdowns
            const developerDropdown = document.querySelector('.developer-dropdown');
            const toolsDropdown = document.querySelector('.tools-dropdown');
            
            if (developerDropdown && developerDropdown.parentElement !== document.body && isMobile) {
                // Move to body for mobile
                document.body.appendChild(developerDropdown);
            } else if (developerDropdown && developerDropdown.parentElement === document.body && !isMobile) {
                // Move back to nav for desktop
                const developerLink = document.querySelector('nav a[data-string-key="developer"]');
                if (developerLink && developerLink.parentElement) {
                    developerLink.parentElement.style.position = 'relative';
                    developerLink.parentElement.appendChild(developerDropdown);
                }
            }
            
            if (toolsDropdown && toolsDropdown.parentElement !== document.body && isMobile) {
                // Move to body for mobile
                document.body.appendChild(toolsDropdown);
            } else if (toolsDropdown && toolsDropdown.parentElement === document.body && !isMobile) {
                // Move back to nav for desktop
                const toolsLink = document.querySelector('nav a[data-string-key="tools"]');
                if (toolsLink && toolsLink.parentElement) {
                    toolsLink.parentElement.style.position = 'relative';
                    toolsLink.parentElement.appendChild(toolsDropdown);
                }
            }
        });
    }

    static initLanguageSwitcher() {
        const langButtons = document.querySelectorAll('.lang-btn');
        langButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all buttons
                langButtons.forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                btn.classList.add('active');
                // Update language
                const lang = btn.id.includes('en') ? 'en' : 'zh';
                this.updateLanguage(lang);
            });
        });
    }

    static initDeveloperMenu() {
        const developerLink = document.querySelector('nav a[data-string-key="developer"]');
        if (!developerLink) return;

        // Create dropdown menu
        const dropdown = document.createElement('div');
        dropdown.className = 'developer-dropdown';

        // Create menu items
        const menuItems = [
            { key: 'chainInfo', href: '../html/chain-info.html' },
            { key: 'nodeOfFCH', href: 'https://github.com/freecashorg/freecash/releases' },
            { key: 'sdk', href: '../html/sdk.html' },
            { key: 'api', href: '../html/api.html' },
            { key: 'docs', href: '../html/docs.html' }
        ];

        menuItems.forEach(item => {
            const menuItem = document.createElement('a');
            menuItem.href = item.href;
            menuItem.setAttribute('data-string-key', item.key);
            // Set initial text using the getString method
            menuItem.textContent = this.getString(item.key);
            dropdown.appendChild(menuItem);
        });

        // Add dropdown to DOM - append to body for mobile compatibility
        if (window.innerWidth <= 600) {
            // On mobile, append to body to avoid positioning issues
            document.body.appendChild(dropdown);
        } else {
            // On desktop, append to parent element
            developerLink.parentElement.style.position = 'relative';
            developerLink.parentElement.appendChild(dropdown);
        }

        // Create backdrop for mobile
        const backdrop = document.createElement('div');
        backdrop.className = 'dropdown-backdrop';
        document.body.appendChild(backdrop);

        // Show/hide dropdown
        developerLink.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const isVisible = dropdown.style.display === 'block';
            
            if (isVisible) {
                this.closeDropdown(dropdown, backdrop);
            } else {
                this.showDropdown(dropdown, backdrop);
            }
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.developer-dropdown') && !e.target.closest('nav a[data-string-key="developer"]')) {
                this.closeDropdown(dropdown, backdrop);
            }
        });

        // Close dropdown when clicking backdrop (mobile)
        backdrop.addEventListener('click', () => {
            this.closeDropdown(dropdown, backdrop);
        });

        // Close dropdown when losing focus
        developerLink.addEventListener('blur', () => {
            setTimeout(() => {
                if (!document.activeElement.closest('.developer-dropdown')) {
                    this.closeDropdown(dropdown, backdrop);
                }
            }, 100);
        });

        // Update menu items text when language changes
        window.addEventListener('languageChanged', () => {
            menuItems.forEach(item => {
                const menuItem = dropdown.querySelector(`[data-string-key="${item.key}"]`);
                if (menuItem) {
                    menuItem.textContent = this.getString(item.key);
                }
            });
        });
    }

    static initToolsMenu() {
        const toolsLink = document.querySelector('nav a[data-string-key="tools"]');
        if (!toolsLink) return;

        // Create dropdown menu
        const dropdown = document.createElement('div');
        dropdown.className = 'tools-dropdown';

        // Create menu items
        const menuItems = [
            { key: 'myCash', href: '../html/myCash.html' },
            { key: 'offlineTX', href: '../html/offlineTx.html' },
            { key: 'broadcastTX', href: '../html/broadcast-tx.html' },
            { key: 'addressConvert', href: '../html/address-convert.html' },
            { key: 'encrypt', href: '../html/encrypt.html' },
            { key: 'verifySignature', href: '../html/verify-signature.html' }
        ];

        menuItems.forEach(item => {
            const menuItem = document.createElement('a');
            menuItem.href = item.href;
            menuItem.setAttribute('data-string-key', item.key);
            // Set initial text using the getString method
            menuItem.textContent = this.getString(item.key);
            dropdown.appendChild(menuItem);
        });

        // Add dropdown to DOM - append to body for mobile compatibility
        if (window.innerWidth <= 600) {
            // On mobile, append to body to avoid positioning issues
            document.body.appendChild(dropdown);
        } else {
            // On desktop, append to parent element
            toolsLink.parentElement.style.position = 'relative';
            toolsLink.parentElement.appendChild(dropdown);
        }

        // Create backdrop for mobile
        const backdrop = document.createElement('div');
        backdrop.className = 'dropdown-backdrop';
        document.body.appendChild(backdrop);

        // Show/hide dropdown
        toolsLink.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const isVisible = dropdown.style.display === 'block';
            
            if (isVisible) {
                this.closeDropdown(dropdown, backdrop);
            } else {
                this.showDropdown(dropdown, backdrop);
            }
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.tools-dropdown') && !e.target.closest('nav a[data-string-key="tools"]')) {
                this.closeDropdown(dropdown, backdrop);
            }
        });

        // Close dropdown when clicking backdrop (mobile)
        backdrop.addEventListener('click', () => {
            this.closeDropdown(dropdown, backdrop);
        });

        // Close dropdown when losing focus
        toolsLink.addEventListener('blur', () => {
            setTimeout(() => {
                if (!document.activeElement.closest('.tools-dropdown')) {
                    this.closeDropdown(dropdown, backdrop);
                }
            }, 100);
        });

        // Update menu items text when language changes
        window.addEventListener('languageChanged', () => {
            menuItems.forEach(item => {
                const menuItem = dropdown.querySelector(`[data-string-key="${item.key}"]`);
                if (menuItem) {
                    menuItem.textContent = this.getString(item.key);
                }
            });
        });
    }

    static initSearch() {
        // Check if search should be disabled
        const disableSearch = document.body.getAttribute('data-disable-header-search') === 'true';
        
        if (disableSearch) {
            // Hide search containers
            const searchContainers = document.querySelectorAll('.nav-search-container, .mobile-search-container');
            searchContainers.forEach(container => {
                container.style.display = 'none';
            });
            return; // Exit early, don't initialize search functionality
        }
        
        const searchInputs = document.querySelectorAll('#desktop-search-input, #mobile-search-input');
        const searchButtons = document.querySelectorAll('#desktop-search-btn, #mobile-search-btn');
        
        searchInputs.forEach(input => {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.performSearch(input.value);
                }
            });
        });

        searchButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Find the closest container that contains both the button and input
                const container = btn.closest('.desktop-search-container, .mobile-search-container');
                if (!container) {
                    // If not found, try finding the parent container
                    const parentContainer = btn.closest('.nav-search-container, .mobile-bottom-bar');
                    if (!parentContainer) {
                        console.error('No search container found for search button', btn);
                        return;
                    }
                    // Find the input within the parent container
                    const input = parentContainer.querySelector('input');
                    if (!input) {
                        console.error('No input found in search container for search button', btn);
                        return;
                    }
                    this.performSearch(input.value);
                    return;
                }
                
                const input = container.querySelector('input');
                if (!input) {
                    console.error('No input found in search container for search button', btn);
                    return;
                }
                this.performSearch(input.value);
            });
        });
    }

    static initMobileMenu() {
        const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
        const navMenu = document.getElementById('nav-menu');
        
        if (mobileMenuToggle && navMenu) {
            mobileMenuToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                mobileMenuToggle.classList.toggle('active');
                
                // Close any open dropdowns when mobile menu is opened
                if (navMenu.classList.contains('active')) {
                    this.closeAllDropdowns();
                }
            });
            
            // Close menu when clicking outside
            document.addEventListener('click', (event) => {
                if (!event.target.closest('nav') && 
                    !event.target.closest('.mobile-menu-toggle') &&
                    !event.target.closest('.mobile-bottom-bar') &&
                    !event.target.closest('.developer-dropdown') &&
                    !event.target.closest('.tools-dropdown')) {
                    this.closeMobileMenu();
                }
            });
        }
    }

    static closeAllDropdowns() {
        const dropdowns = document.querySelectorAll('.developer-dropdown, .tools-dropdown');
        const backdrops = document.querySelectorAll('.dropdown-backdrop');
        
        dropdowns.forEach(dropdown => {
            dropdown.style.display = 'none';
        });
        
        backdrops.forEach(backdrop => {
            backdrop.classList.remove('active');
        });
        
        // Restore body scroll
        document.body.style.overflow = '';
    }

    static updateLanguageUI(lang) {
        // Update all language buttons
        const langButtons = document.querySelectorAll('.lang-btn');
        langButtons.forEach(btn => {
            btn.classList.toggle('active', btn.id.includes(lang));
        });
        
        // Update document language
        document.documentElement.lang = lang;
    }

    static updateLanguage(lang) {
        // Save language preference
        localStorage.setItem('preferredLanguage', lang);
        window.currentLanguage = lang;
        
        // Update UI
        this.updateLanguageUI(lang);
        
        // Update all strings
        this.updateAllStrings();
        
        // 特别更新主页面的字符串
        if (typeof window.strings !== 'undefined' && window.strings[lang]) {
            this.updateHomepageStrings(window.strings[lang]);
        }
        
        // Trigger language update event
        window.dispatchEvent(new CustomEvent('languageChanged', { 
            detail: { lang },
            bubbles: true
        }));
    }

    static updateAllStrings() {
        if (!window.strings || !window.currentLanguage) {
            console.error('Strings or current language not available');
            return;
        }

        const strings = window.strings[window.currentLanguage];
        if (!strings) {
            console.error(`No strings found for language: ${window.currentLanguage}`);
            return;
        }

        // Call the global updateAllStrings function first
        if (typeof window.updateAllStrings === 'function') {
            window.updateAllStrings();
        }

        // Update header strings
        this.updateHeaderStrings(strings);
        
        // Update footer strings
        this.updateFooterStrings(strings);
        
        // Update homepage strings if on homepage
        if (typeof window.Homepage !== 'undefined' && window.Homepage.updateHomepageStrings) {
            window.Homepage.updateHomepageStrings();
        }

        // Update cash list strings if on cash list page
        if (typeof window.CashList !== 'undefined' && window.CashList.updateStrings) {
            window.CashList.updateStrings();
        }

        // Update cash detail strings if on cash detail page
        if (typeof window.CashDetail !== 'undefined' && window.CashDetail.updateStrings) {
            window.CashDetail.updateStrings();
        }

        // Update address convert strings if on address convert page
        if (typeof window.AddressConvert !== 'undefined' && window.AddressConvert.updateStrings) {
            window.AddressConvert.updateStrings();
        }

        // Update encrypt strings if on encrypt page
        if (typeof window.Encrypt !== 'undefined' && window.Encrypt.updateStrings) {
            window.Encrypt.updateStrings();
        }

        // 特别处理主页面的板块和卡片标题
        this.updateHomepageStrings(strings);
    }

    static updateHeaderStrings(strings) {
        // Update site title
        const siteTitle = document.querySelector('.site-title');
        if (siteTitle) {
            siteTitle.textContent = strings.siteTitle || 'Freeverse';
        }

        // Update navigation links
        const navLinks = document.querySelectorAll('nav a[data-string-key]');
        navLinks.forEach(link => {
            const key = link.getAttribute('data-string-key');
            if (key && strings[key]) {
                link.textContent = strings[key];
            }
        });

        // Update dropdown menu items
        const dropdownItems = document.querySelectorAll('.developer-dropdown a[data-string-key], .tools-dropdown a[data-string-key]');
        dropdownItems.forEach(item => {
            const key = item.getAttribute('data-string-key');
            if (key && strings[key]) {
                item.textContent = strings[key];
            }
        });

        // Update search inputs using search configuration
        updateSearchInputs(strings);

        // Update mobile menu items
        const mobileMenuItems = document.querySelectorAll('#mobile-menu a[data-string-key]');
        mobileMenuItems.forEach(item => {
            const key = item.getAttribute('data-string-key');
            if (key && strings[key]) {
                item.textContent = strings[key];
            }
        });
    }

    static updateFooterStrings(strings) {
        const footer = document.querySelector('footer p');
        if (footer) {
            footer.textContent = strings.copyright || '';
        }
    }

    static updateHomepageStrings(strings) {
        // Update section titles
        const blockchainTitle = document.getElementById('blockchain-title');
        if (blockchainTitle) blockchainTitle.textContent = strings.blockchain || '...';
        
        const identityTitle = document.getElementById('identity-title');
        if (identityTitle) identityTitle.textContent = strings.identity || '...';
        
        const constructTitle = document.getElementById('construct-title');
        if (constructTitle) constructTitle.textContent = strings.construct || '...';
        
        const organizationTitle = document.getElementById('organization-title');
        if (organizationTitle) organizationTitle.textContent = strings.organization || '...';
        
        const personalTitle = document.getElementById('personal-title');
        if (personalTitle) personalTitle.textContent = strings.personal || '...';
        
        const publishTitle = document.getElementById('publish-title');
        if (publishTitle) publishTitle.textContent = strings.publish || '...';
        
        const businessTitle = document.getElementById('business-title');
        if (businessTitle) businessTitle.textContent = strings.business || '...';

        // Update stat cards with new blockchain terms
        const statCards = document.querySelectorAll('#home .section-container:nth-child(1) .stats-grid .stat-card h3');
        const statKeys = ['cash', 'tx', 'opreturn', 'block'];
        statCards.forEach((card, index) => {
            if (statKeys[index]) {
                const value = strings[statKeys[index]];
                if (value) card.textContent = value;
            }
        });
        
        // Update Identity stat cards
        const identityStatCards = document.querySelectorAll('#home .section-container:nth-child(2) .stats-grid .stat-card h3');
        const identityStatKeys = ['cid', 'nobody', 'multisign', 'nid'];
        identityStatCards.forEach((card, index) => {
            if (identityStatKeys[index]) {
                const value = strings[identityStatKeys[index]];
                if (value) card.textContent = value;
            }
        });
        
        // Update Construct stat cards
        const constructStatCards = document.querySelectorAll('#home .section-container:nth-child(3) .stats-grid .stat-card h3');
        const constructStatKeys = ['protocol', 'code', 'service', 'app'];
        constructStatCards.forEach((card, index) => {
            if (constructStatKeys[index]) {
                const value = strings[constructStatKeys[index]];
                if (value) card.textContent = value;
            }
        });
        
        // Update Organization stat cards
        const organizationStatCards = document.querySelectorAll('#home .section-container:nth-child(4) .stats-grid .stat-card h3');
        const organizationStatKeys = ['group', 'team'];
        organizationStatCards.forEach((card, index) => {
            if (organizationStatKeys[index]) {
                const value = strings[organizationStatKeys[index]];
                if (value) card.textContent = value;
            }
        });
        
        // Update Personal stat cards
        const personalStatCards = document.querySelectorAll('#home .section-container:nth-child(5) .stats-grid .stat-card h3');
        const personalStatKeys = ['mail', 'contact', 'secret', 'box'];
        personalStatCards.forEach((card, index) => {
            if (personalStatKeys[index]) {
                const value = strings[personalStatKeys[index]];
                if (value) card.textContent = value;
            }
        });
        
        // Update Publish stat cards
        const publishStatCards = document.querySelectorAll('#home .section-container:nth-child(6) .stats-grid .stat-card h3');
        const publishStatKeys = ['statement', 'essay', 'report', 'paper', 'book', 'artwork', 'remark'];
        publishStatCards.forEach((card, index) => {
            if (publishStatKeys[index]) {
                const value = strings[publishStatKeys[index]];
                if (value) card.textContent = value;
            }
        });
        
        // Update Business stat cards
        const businessStatCards = document.querySelectorAll('#home .section-container:nth-child(7) .stats-grid .stat-card h3');
        const businessStatKeys = ['proof', 'token', 'tokenHolder'];
        businessStatCards.forEach((card, index) => {
            if (businessStatKeys[index]) {
                const value = strings[businessStatKeys[index]];
                if (value) card.textContent = value;
            }
        });
    }

    static performSearch(query) {
        if (!query.trim()) return;
        
        // Trigger search event
        window.dispatchEvent(new CustomEvent('performSearch', { 
            detail: { query: query.trim() }
        }));
    }

    static closeMobileMenu() {
        const navMenu = document.getElementById('nav-menu');
        const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
        
        if (navMenu) {
            navMenu.classList.remove('active');
            navMenu.parentElement.classList.remove('active');
        }
        
        if (mobileMenuToggle) {
            mobileMenuToggle.classList.remove('active');
        }
        
        // Restore body scroll
        document.body.style.overflow = '';
    }

    static showDropdown(dropdown, backdrop) {
        // Close any other open dropdowns first
        this.closeAllDropdowns();
        
        // Set dropdown display to block first
        dropdown.style.display = 'block';
        
        // Show backdrop
        backdrop.classList.add('active');
        
        // Prevent body scroll on mobile
        if (window.innerWidth <= 600) {
            document.body.style.overflow = 'hidden';
            
            // Ensure dropdown is properly positioned for mobile
            // Force a reflow to ensure proper positioning
            dropdown.offsetHeight;
            
            // Double-check dropdown is visible
            if (dropdown.style.display !== 'block') {
                dropdown.style.display = 'block';
            }
            
            // Add animation class after a small delay to trigger the slide-in effect
            setTimeout(() => {
                dropdown.classList.add('show');
            }, 10);
        }
        
        // Close mobile menu if it's open
        const navMenu = document.getElementById('nav-menu');
        const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
        if (navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            if (mobileMenuToggle) {
                mobileMenuToggle.classList.remove('active');
            }
        }
    }

    static closeDropdown(dropdown, backdrop) {
        // Remove animation class first
        dropdown.classList.remove('show');
        
        // Wait for animation to complete before hiding
        setTimeout(() => {
            // Hide dropdown
            dropdown.style.display = 'none';
            
            // Hide backdrop
            backdrop.classList.remove('active');
            
            // Restore body scroll on mobile
            if (window.innerWidth <= 600) {
                document.body.style.overflow = '';
            }
        }, 300); // Match the CSS transition duration
    }
}

export default Header; 