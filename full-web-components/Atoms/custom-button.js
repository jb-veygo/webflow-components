class CustomButton extends HTMLElement {
    static get observedAttributes() {
        return ["variant", "size", "disabled", "loading", "success"];
    }

    constructor() {
        super();
        this.attachShadow({ mode: "open" });

        this.button = document.createElement("button");
        this.button.classList.add("custom-button", "default");

        // Check for loading state
        if (this.hasAttribute("loading")) {
            this.button.innerHTML = `<span class="spinner"></span> Loading...`;
        } else if (this.hasAttribute("success")) {
            this.button.innerHTML = `✔ Success`;
            this.button.classList.add("success");
        } else {
            this.button.innerHTML = `<slot></slot>`;
        }

        this.updateAttributes();

        // ShadCN Styling (Matches Early Working Version)
        const style = document.createElement("style");
        style.textContent = `
            :host {
                display: inline-block;
            }

            .custom-button {
                display: flex;
                width: 100%;
                align-items: center;
                justify-content: center;
                padding: 0.5rem 1rem;
                font-size: 0.875rem;
                font-weight: 500;
                border-radius: 0.375rem;
                border: 1px solid transparent;
                cursor: pointer;
                transition: all 0.2s ease-in-out;
                text-align: center;
                white-space: nowrap;
                user-select: none;
            }

            /* Default Button (Primary) */
            .custom-button.default {
                background: #1e40af;
                color: white;
            }

            .custom-button.default:hover {
                background: #1e3a8a;
            }

            .custom-button:active {
                transform: scale(0.98);
                filter: brightness(0.9);
            }

            /* Outline Button */
            .custom-button.outline {
                background: transparent;
                border: 1px solid #1e40af;
                color: #1e40af;
            }

            .custom-button.outline:hover {
                background: rgba(30, 64, 175, 0.1);
            }

            /* Ghost Button */
            .custom-button.ghost {
                background: transparent;
                color: #1e40af;
            }

            .custom-button.ghost:hover {
                background: rgba(30, 64, 175, 0.1);
            }

            /* Destructive Button */
            .custom-button.destructive {
                background: #dc2626;
                color: white;
            }

            .custom-button.destructive:hover {
                background: #b91c1c;
            }

            /* Secondary Button */
            .custom-button.secondary {
                background: #64748b;
                color: white;
            }

            .custom-button.secondary:hover {
                background: #475569;
            }

            /* Link Button */
            .custom-button.link {
                background: transparent;
                color: #1e40af;
                text-decoration: underline;
            }

            .custom-button.link:hover {
                color: #1e3a8a;
            }

            /* Sizes */
            .custom-button.sm {
                padding: 0.25rem 0.5rem;
                font-size: 0.75rem;
            }

            .custom-button.md {
                padding: 0.5rem 1rem;
                font-size: 0.875rem;
            }

            .custom-button.lg {
                padding: 0.75rem 1.25rem;
                font-size: 1rem;
            }

            /* Disabled State */
            .custom-button:disabled {
                opacity: 0.5;
                cursor: not-allowed;
                pointer-events: none;
            }

            .custom-button.loading {
                cursor: wait;
                pointer-events: none;
                background: #a3a3a3;
                color: white;
            }

            .custom-button.success {
                background: #0f766e;
                color: white;
            }

            .spinner {
                display: inline-block;
                width: 16px;
                height: 16px;
                border: 2px solid white;
                border-top-color: transparent;
                border-radius: 50%;
                animation: spin 1s linear infinite;
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

        this.button.className = `custom-button ${variant} ${size}`;
        this.button.disabled = disabled;
    }
}

customElements.define("custom-button", CustomButton);