class CustomButton extends HTMLElement {
    static get observedAttributes() {
        return ["variant", "size", "disabled"];
    }

    constructor() {
        super();
        this.attachShadow({ mode: "open" });

        this.button = document.createElement("button");
        this.button.classList.add("custom-button", "default");

        // Slot allows text & icons inside the button
        this.button.innerHTML = `<slot></slot>`;

        this.updateAttributes();

        // ShadCN Styling (Matches Early Working Version)
        const style = document.createElement("style");
        style.textContent = `
            :host {
                display: inline-block;
            }

            .custom-button {
                display: inline-flex;
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

            .custom-button.default:active {
                background: #1e3a8a;
                transform: scale(0.98);
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