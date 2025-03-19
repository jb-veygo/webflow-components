class CustomButton extends HTMLElement {
    static get observedAttributes() {
        return ["variant", "size", "disabled"];
    }

    constructor() {
        super();
        this.attachShadow({ mode: "open" });

        this.button = document.createElement("button");
        this.button.classList.add("custom-button");
        this.button.innerHTML = `<slot></slot>`;

        this.updateAttributes();

        // Updated ShadCN UI button styles
        const style = document.createElement("style");
        style.textContent = `
            :host {
                display: inline-block;
                flex-grow: 1;
            }

            .custom-button {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                border-radius: 0.375rem;
                border: 1px solid transparent;
                font-size: 0.875rem;
                font-weight: 500;
                transition: background-color 0.2s ease-in-out, border-color 0.2s ease-in-out;
                padding: 0.5rem 1rem;
                white-space: nowrap;
                cursor: pointer;
                user-select: none;
                width: 100%;
            }

            .custom-button:focus-visible {
                outline: 2px solid rgba(30, 64, 175, 0.5);
                outline-offset: 2px;
            }

            /* Variants */
            .custom-button.default {
                background-color: #1e40af;
                color: white;
            }

            .custom-button.default:hover {
                background-color: #1e3a8a;
            }

            .custom-button.outline {
                background-color: transparent;
                border-color: #1e40af;
                color: #1e40af;
            }

            .custom-button.outline:hover {
                background-color: rgba(30, 64, 175, 0.1);
            }

            .custom-button.destructive {
                background-color: #dc2626;
                color: white;
            }

            .custom-button.destructive:hover {
                background-color: #b91c1c;
            }

            .custom-button.link {
                background-color: transparent;
                color: #1e40af;
                text-decoration: underline;
            }

            .custom-button.link:hover {
                color: #1e3a8a;
            }

            /* Sizes */
            .custom-button.sm {
                height: 2rem;
                font-size: 0.75rem;
            }

            .custom-button.md {
                height: 2.5rem;
                font-size: 0.875rem;
            }

            .custom-button.lg {
                height: 3rem;
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
        console.log("CustomButton component loaded successfully.");
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