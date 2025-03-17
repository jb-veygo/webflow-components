class CustomInput extends HTMLElement {
    static get observedAttributes() {
        return ["type", "placeholder", "variant", "size", "disabled", "error"];
    }

    constructor() {
        super();
        this.attachShadow({ mode: "open" });

        // Wrapper for input
        this.wrapper = document.createElement("div");
        this.wrapper.classList.add("input-wrapper");

        // Label
        this.label = document.createElement("label");
        this.label.classList.add("input-label");
        this.label.innerHTML = `<slot name="label"></slot>`;

        // Input Field
        this.input = document.createElement("input");
        this.input.classList.add("custom-input");

        // Error Message
        this.errorMessage = document.createElement("span");
        this.errorMessage.classList.add("input-error");
        this.errorMessage.style.display = "none";

        // Append elements
        this.wrapper.appendChild(this.label);
        this.wrapper.appendChild(this.input);
        this.wrapper.appendChild(this.errorMessage);

        // Apply Attributes & Styling
        this.updateAttributes();

        // Styles
        const style = document.createElement("style");
        style.textContent = `
            .input-wrapper {
                display: flex;
                flex-direction: column;
                gap: var(--spacing-xs);
                width: 100%;
            }

            .input-label {
                font-size: var(--font-body, 14px);
                color: var(--color-text, #333);
                font-weight: 600;
            }

            .custom-input {
                width: 100%;
                padding: var(--spacing-md);
                border-radius: var(--border-radius-md);
                font-size: var(--font-body);
                border: 1px solid var(--color-border, #ddd);
                transition: border-color 0.2s ease-in-out;
            }

            /* Variants */
            .custom-input.outline {
                border: 2px solid var(--color-primary);
            }

            .custom-input.ghost {
                border: none;
                background: transparent;
            }

            .custom-input:focus {
                border-color: var(--color-primary-dark);
                outline: none;
            }

            /* Sizes */
            .custom-input.sm { padding: var(--spacing-xs); font-size: 14px; }
            .custom-input.md { padding: var(--spacing-md); font-size: 16px; }
            .custom-input.lg { padding: var(--spacing-lg); font-size: 18px; }

            /* Disabled State */
            .custom-input:disabled {
                background: var(--color-muted, #f3f3f3);
                cursor: not-allowed;
            }

            /* Error State */
            .input-error {
                color: var(--color-danger, red);
                font-size: 12px;
            }
        `;

        this.shadowRoot.appendChild(style);
        this.shadowRoot.appendChild(this.wrapper);
    }

    attributeChangedCallback() {
        this.updateAttributes();
    }

    updateAttributes() {
        this.input.setAttribute("type", this.getAttribute("type") || "text");
        this.input.setAttribute("placeholder", this.getAttribute("placeholder") || "");
        this.input.className = `custom-input ${this.getAttribute("variant") || "default"} ${this.getAttribute("size") || "md"}`;
        this.input.disabled = this.hasAttribute("disabled");

        if (this.hasAttribute("error")) {
            this.errorMessage.textContent = this.getAttribute("error");
            this.errorMessage.style.display = "block";
        } else {
            this.errorMessage.style.display = "none";
        }
    }
}

customElements.define("custom-input", CustomInput);