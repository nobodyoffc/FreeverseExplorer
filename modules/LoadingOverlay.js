// Loading Overlay Module
class LoadingOverlay {
    constructor() {
        this.overlay = null;
        this.init();
    }

    init() {
        // Create overlay if it doesn't exist
        if (!document.getElementById('loading-overlay')) {
            this.overlay = document.createElement('div');
            this.overlay.id = 'loading-overlay';
            this.overlay.className = 'loading-overlay';
            this.overlay.innerHTML = `
                <div class="loading-spinner"></div>
                <div class="loading-text">Loading...</div>
            `;
            document.body.appendChild(this.overlay);
        } else {
            this.overlay = document.getElementById('loading-overlay');
        }
    }

    show() {
        if (this.overlay) {
            this.overlay.style.display = 'flex';
        }
    }

    hide() {
        if (this.overlay) {
            this.overlay.style.display = 'none';
        }
    }

    setText(text) {
        const textElement = this.overlay.querySelector('.loading-text');
        if (textElement) {
            textElement.textContent = text;
        }
    }
}

// Export the module
window.LoadingOverlay = LoadingOverlay; 