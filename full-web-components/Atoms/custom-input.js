class CustomInput extends HTMLElement {
    static get observedAttributes() {
        return ["type", "placeholder", "disabled", "value", "error"];
    }

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.wrapper = document.createElement("div");
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = "";
        
        // Wrapper
        this.wrapper.classList.add("input-wrapper");
        
        // Label
        this.label = document.createElement("label");
        this.label.classList.add("input-label");
        this.label.innerHTML = `<slot name="label"></slot>`;

        // Input Container (For Icons)
        this.inputContainer = document.createElement("div");
        this.inputContainer.classList.add("input-container");

        // Leading Icon Slot
        this.leadingIcon = document.createElement("span");
        this.leadingIcon.classList.add("leading-icon");
        this.leadingIcon.innerHTML = `<slot name="leading-icon"></slot>`;

        // Input Field
        this.input = document.createElement("input");
        this.input.classList.add("shadcn-input");
        this.input.setAttribute("id", "input-field");
        this.updateAttributes();

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
                width: 100%;
                padding: 0.75rem;
                font-size: 0.875rem;
                border-radius: 0.5rem;
                border: 1px solid #e5e7eb;
                background: white;
                color: #111827;
                transition: border-color 0.2s ease-in-out;
                outline: none;
            }

            .shadcn-input:focus {
                border-color: #1e40af;
                box-shadow: 0 0 0 2px rgba(30, 64, 175, 0.2);
            }

            .shadcn-input:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }

            .leading-icon, .trailing-icon {
                display: flex;
                align-items: center;
                padding: 0 var(--spacing-xs);
            }

            .input-container:focus-within {
                border-color: var(--color-primary-dark);
            }

            .shadcn-input.error {
                border-color: red;
            }

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
        this.input.type = this.getAttribute("type") || "text";
        this.input.placeholder = this.getAttribute("placeholder") || "";
        this.input.disabled = this.hasAttribute("disabled");
        this.input.value = this.getAttribute("value") || "";

        if (this.hasAttribute("error")) {
            this.errorMessage.textContent = this.getAttribute("error");
            this.errorMessage.style.display = "block";
            this.input.classList.add("error");
            this.input.setAttribute("aria-invalid", "true");
        } else {
            this.errorMessage.style.display = "none";
            this.input.classList.remove("error");
        }
    }
}

customElements.define("custom-input", CustomInput);