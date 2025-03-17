class CustomButton extends HTMLElement {
    static get observedAttributes() {
        return ["variant", "size", "disabled", "loading"];
    }

    constructor() {
        super();
        this.attachShadow({ mode: "open" });

        this.button = document.createElement("button");
        this.button.classList.add("custom-button");

        // Slot to allow icons & text inside the button
        this.button.innerHTML = `<slot></slot>`;

        this.updateAttributes();

        // Button styles (ShadCN-style)
        const style = document.createElement("style");
        style.textContent = `
            .custom-button {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                padding: var(--spacing-md);
                font-size: var(--font-body);
                border-radius: var(--border-radius-md);
                border: 1px solid transparent;
                cursor: pointer;
                font-weight: 500;
                transition: all 0.2s ease-in-out;
                user-select: none;
            }

            /* Variants */
            .custom-button.default {
                background: var(--color-primary);
                color: white;
            }

            .custom-button.outline {
                background: transparent;
                border: 1px solid var(--color-primary);
                color: var(--color-primary);
            }

            .custom-button.ghost {
                background: transparent;
                color: var(--color-primary);
            }

            .custom-button.destructive {
                background: var(--color-danger);
                color: white;
            }

            .custom-button.secondary {
                background: var(--color-secondary);
                color: white;
            }

            .custom-button.link {
                background: transparent;
                color: var(--color-primary);
                text-decoration: underline;
            }

            /* Sizes */
            .custom-button.sm {
                padding: var(--spacing-xs);
                font-size: 14px;
            }

            .custom-button.md {
                padding: var(--spacing-md);
                font-size: 16px;
            }

            .custom-button.lg {
                padding: var(--spacing-lg);
                font-size: 18px;
            }

            /* Hover & Active States */
            .custom-button:not(:disabled):hover {
                filter: brightness(90%);
            }

            .custom-button:not(:disabled):active {
                transform: scale(0.98);
            }

            /* Disabled State */
            .custom-button:disabled {
                opacity: 0.6;
                cursor: not-allowed;
            }

            /* Loading Animation */
            .custom-button .spinner {
                width: 16px;
                height: 16px;
                border: 2px solid white;
                border-top-color: transparent;
                border-radius: 50%;
                display: inline-block;
                animation: spin 1s linear infinite;
                margin-right: 8px;
            }

            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        this.shadowRoot.appendChild(style);
        this.shadowRoot.appendChild(this.button);
    }

    attributeChangedCallback() {
        this.updateAttributes();
    }

    updateAttributes() {
        const variant = this.getAttribute("variant") || "default";
        const size = this.getAttribute("size") || "md";
        const disabled = this.hasAttribute("disabled");
        const loading = this.hasAttribute("loading");

        this.button.className = `custom-button ${variant} ${size}`;
        this.button.disabled = disabled;

        // If loading is enabled, show spinner
        if (loading) {
            this.button.innerHTML = `<span class="spinner"></span><slot></slot>`;
        } else {
            this.button.innerHTML = `<slot></slot>`;
        }
    }
}

customElements.define("custom-button", CustomButton);