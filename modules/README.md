# Data Visualization Dashboard

A modern, responsive data visualization dashboard with internationalization support for English and Chinese.

## Features

- 📊 Interactive data visualization (Line charts, Bar charts, Pie charts)
- 📱 Fully responsive design for mobile, tablet, and desktop
- 🌍 Multi-language support (English/Chinese)
- 🔍 Data search and filtering
- 📄 Paginated data tables
- 💾 Language preference persistence

## Internationalization (i18n)

The application uses a comprehensive string management system to support multiple languages.

### Structure

- **`strings.js`** - Contains all localized strings for English (`en`) and Chinese (`zh`)
- Language switcher in the header allows real-time language switching
- Language preference is saved to localStorage

### Adding New Languages

1. Add a new language object to the `strings` object in `strings.js`:

```javascript
const strings = {
    en: { /* English strings */ },
    zh: { /* Chinese strings */ },
    es: { /* Spanish strings */ },
    // Add your new language here
};
```

2. Add a new language button to the header in `index.html`:

```html
<div class="language-switcher">
    <button id="lang-en" class="lang-btn">EN</button>
    <button id="lang-zh" class="lang-btn">中文</button>
    <button id="lang-es" class="lang-btn">ES</button>
</div>
```

3. Update the `setupLanguageSwitcher()` function in `script.js` to handle the new button.

### Adding New Strings

When adding new UI text:

1. **Find or add the string** in `strings.js` for all supported languages:

```javascript
const strings = {
    en: {
        newFeature: "New Feature",
        // ... other strings
    },
    zh: {
        newFeature: "新功能",
        // ... other strings  
    }
};
```

2. **Use the string** in your code:

```javascript
// Simple string
element.textContent = getString('newFeature');

// String with parameters
element.textContent = getStringWithParams('pageOf', currentPage, totalPages);
```

3. **Update DOM elements** by calling `updateAllStrings()` if needed.

### Key Functions

- `getString(key)` - Get localized string by key
- `getStringWithParams(key, ...params)` - Get localized string with parameter substitution
- `switchLanguage(lang)` - Switch to specified language
- `updateAllStrings()` - Update all DOM elements with current language strings

### Language Codes

- `en` - English
- `zh` - Chinese (Simplified)

## File Structure

```
├── index.html          # Main HTML file
├── styles.css          # Stylesheet with responsive design
├── script.js           # Main JavaScript functionality
├── strings.js          # Internationalization strings
└── README.md          # This file
```

## Getting Started

1. Open `index.html` in your web browser
2. Use the language switcher (EN/中文) in the header to change languages
3. Navigate between sections using the menu
4. Interact with charts, search data, and explore the dashboard

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Responsive design supports screens from 320px to 1200px+

## Contributing

When contributing new features:

1. Add all user-facing strings to `strings.js` for both languages
2. Use `getString()` and `getStringWithParams()` for all text content
3. Test language switching functionality
4. Ensure mobile responsiveness

## License

Built with HTML, CSS, and JavaScript. Feel free to use and modify. 