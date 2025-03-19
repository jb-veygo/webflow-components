class CustomInput extends HTMLElement {
    static get observedAttributes() {
        return ["type", "placeholder", "variant", "size", "disabled", "error", "value"];
    }

    constructor() {
        super();
        this.attachShadow({ mode: "open" });

        // Wrapper
        this.wrapper = document.createElement("div");
        this.wrapper.classList.add("input-wrapper");

        // Label
        this.label = document.createElement("label");
        this.label.classList.add("input-label");
        this.label.innerHTML = `<slot name="label"></slot>`;

        // Input Container (For Icons)
        this.inputContainer = document.createElement("div");
        this.inputContainer.classList.add("input-container", "shadcn-input");

        // Leading Icon Slot
        this.leadingIcon = document.createElement("span");
        this.leadingIcon.classList.add("leading-icon");
        this.leadingIcon.innerHTML = `<slot name="leading-icon"></slot>`;

        // Input Field
        this.input = document.createElement("input");
        this.input.classList.add("custom-input");

        // Trailing Icon Slot
        this.trailingIcon = document.createElement("span");
        this.trailingIcon.classList.add("trailing-icon");
        this.trailingIcon.innerHTML = `<slot name="trailing-icon"></slot>`;

        // Error Message
        this.errorMessage = document.createElement("span");
        this.errorMessage.classList.add("input-error");
        this.errorMessage.style.display = "none";

        // Append elements
        this.inputContainer.appendChild(this.leadingIcon);
        this.inputContainer.appendChild(this.input);
        this.inputContainer.appendChild(this.trailingIcon);
        this.wrapper.appendChild(this.label);
        this.wrapper.appendChild(this.inputContainer);
        this.wrapper.appendChild(this.errorMessage);

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

            .shadcn-input {
                display: flex;
                align-items: center;
                width: 100%;
                padding: 0.75rem;
                font-size: 0.875rem;
                border-radius: 0.5rem;
                border: 1px solid #e5e7eb;
                background: white;
                transition: border-color 0.2s ease-in-out;
            }

            .custom-input {
                flex-grow: 1;
                border: none;
                outline: none;
                font-size: var(--font-body, 16px);
                padding: var(--spacing-xs);
                background: transparent;
            }

            .leading-icon, .trailing-icon {
                display: flex;
                align-items: center;
                padding: 0 var(--spacing-xs);
            }

            .shadcn-input:focus-within {
                border-color: #1e40af;
                box-shadow: 0 0 0 2px rgba(30, 64, 175, 0.2);
            }

            .shadcn-input:disabled {
                background: #f3f4f6;
                cursor: not-allowed;
            }

            /* Variants */
            .input-container.outline {
                border: 2px solid var(--color-primary);
            }

            .input-container.ghost {
                border: none;
                background: transparent;
            }

            .input-container:focus-within {
                border-color: var(--color-primary-dark);
            }

            /* Sizes */
            .custom-input.sm { font-size: 14px; padding: var(--spacing-xs); }
            .custom-input.md { font-size: 16px; padding: var(--spacing-md); }
            .custom-input.lg { font-size: 18px; padding: var(--spacing-lg); }

            /* Disabled State */
            .custom-input:disabled {
                background: var(--color-muted, #f3f3f3);
                cursor: not-allowed;
            }

            /* Error State */
            .shadcn-input.error {
                border-color: red;
            }

            .input-error {
                color: var(--color-danger, red);
                font-size: 12px;
            }

            .custom-input:focus {
                border-color: #1e40af;
                outline: none;
                box-shadow: 0 0 0 2px rgba(30, 64, 175, 0.2);
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
        this.input.setAttribute("autocomplete", "off");
        this.input.setAttribute("autocorrect", "off");
        this.input.setAttribute("spellcheck", "false");
        this.inputContainer.className = `input-container ${this.getAttribute("variant") || "default"} ${this.getAttribute("size") || "md"}`;
        this.input.disabled = this.hasAttribute("disabled");
        this.input.setAttribute("role", "textbox");
        this.input.setAttribute("aria-disabled", this.hasAttribute("disabled") ? "true" : "false");
        this.input.setAttribute("aria-invalid", this.hasAttribute("error") ? "true" : "false");

        this.input.value = this.getAttribute("value") || "";

        if (this.hasAttribute("error")) {
            this.errorMessage.textContent = this.getAttribute("error");
            this.errorMessage.style.display = "block";
            this.inputContainer.classList.add("error");
            this.input.setAttribute("aria-invalid", "true");
        } else {
            this.errorMessage.style.display = "none";
            this.inputContainer.classList.remove("error");
        }
    }
}

customElements.define("custom-input", CustomInput);