class CustomCombobox extends HTMLElement {
    static get observedAttributes() {
        return ["placeholder", "variant", "size", "disabled", "options"];
    }

    constructor() {
        super();
        this.attachShadow({ mode: "open" });

        // Wrapper
        this.wrapper = document.createElement("div");
        this.wrapper.classList.add("combobox-wrapper");

        // Label
        this.label = document.createElement("label");
        this.label.classList.add("combobox-label");
        this.label.innerHTML = `<slot name="label"></slot>`;

        // Input Container (for icons)
        this.inputContainer = document.createElement("div");
        this.inputContainer.classList.add("combobox-container", "rounded-input");

        // Leading Icon Slot
        this.leadingIcon = document.createElement("span");
        this.leadingIcon.classList.add("leading-icon");
        this.leadingIcon.innerHTML = `<svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h.001c.03.04.062.078.098.114l3.85 3.85a1 1 0 0 0 1.414-1.414l-3.85-3.85a1.007 1.007 0 0 0-.114-.098zM6.5 11a4.5 4.5 0 1 1 0-9 4.5 4.5 0 0 1 0 9z"></path></svg>`;

        // Input Field
        this.input = document.createElement("input");
        this.input.classList.add("custom-input");
        this.input.setAttribute("type", "text");
        this.input.setAttribute("autocomplete", "off");
        this.input.setAttribute("role", "combobox");
        this.input.setAttribute("aria-haspopup", "listbox");
        this.input.setAttribute("aria-expanded", "false");
        this.input.setAttribute("aria-autocomplete", "list");

        // Dropdown List
        this.dropdown = document.createElement("ul");
        this.dropdown.classList.add("combobox-dropdown");
        this.dropdown.style.display = "none";

        // Trailing Icon Slot
        this.trailingIcon = document.createElement("span");
        this.trailingIcon.classList.add("trailing-icon");
        this.trailingIcon.innerHTML = `<slot name="trailing-icon">▼</slot>`;

        // Append elements
        this.inputContainer.appendChild(this.leadingIcon);
        this.inputContainer.appendChild(this.input);
        this.inputContainer.appendChild(this.trailingIcon);
        this.wrapper.appendChild(this.label);
        this.wrapper.appendChild(this.inputContainer);
        this.wrapper.appendChild(this.dropdown);

        this.updateAttributes();

        // Styles
        const style = document.createElement("style");
        style.textContent = `
            .combobox-wrapper {
                display: flex;
                flex-direction: column;
                gap: var(--spacing-xs);
                width: 100%;
                position: relative;
            }

            .combobox-label {
                font-size: var(--font-body, 14px);
                color: var(--color-text, #333);
                font-weight: 600;
            }

            .combobox-container {
                display: flex;
                align-items: center;
                border: 1px solid #e5e7eb;
                border-radius: 0.5rem;
                padding: 0.75rem;
                background: white;
                cursor: pointer;
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

            .combobox-dropdown {
                position: absolute;
                top: 100%;
                left: 0;
                width: 100%;
                background: white;
                border-radius: 0.5rem;
                box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
                overflow: hidden;
                padding: 0.5rem 0;
                max-height: 250px;
                overflow-y: auto;
            }

            .combobox-dropdown li {
                padding: 0.75rem;
                cursor: pointer;
                transition: background 0.2s;
                font-size: 14px;
            }

            .combobox-dropdown li:hover, .combobox-dropdown li:focus {
                background: #e0e7ff;
            }

            .combobox-dropdown li:active {
                background: #d1d5db;
            }

            /* Variants */
            .combobox-container.outline {
                border: 2px solid var(--color-primary);
            }

            .combobox-container.ghost {
                border: none;
                background: transparent;
            }

            .combobox-container:focus-within {
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
        `;

        this.shadowRoot.appendChild(style);
        this.shadowRoot.appendChild(this.wrapper);

        // Event Listeners
        this.input.addEventListener("input", () => this.filterOptions());
        this.input.addEventListener("focus", () => this.showDropdown());
        document.addEventListener("click", (e) => this.handleOutsideClick(e));
    }

    attributeChangedCallback() {
        this.updateAttributes();
    }

    updateAttributes() {
        this.input.setAttribute("placeholder", this.getAttribute("placeholder") || "Select an option");
        this.inputContainer.className = `combobox-container ${this.getAttribute("variant") || "default"} ${this.getAttribute("size") || "md"}`;
        this.input.disabled = this.hasAttribute("disabled");

        // Populate dropdown options
        const options = this.getAttribute("options") ? this.getAttribute("options").split(",") : [];
        this.dropdown.innerHTML = "";
        options.forEach((option) => {
            const li = document.createElement("li");
            li.textContent = option.trim();
            li.addEventListener("click", () => this.selectOption(option.trim()));
            this.dropdown.appendChild(li);
        });
    }

    filterOptions() {
        const value = this.input.value.toLowerCase();
        const items = this.dropdown.querySelectorAll("li");

        items.forEach((item) => {
            item.style.display = item.textContent.toLowerCase().includes(value) ? "block" : "none";
        });
    }

    showDropdown() {
        this.dropdown.style.display = "block";
        this.input.setAttribute("aria-expanded", "true");
    }

    hideDropdown() {
        this.dropdown.style.display = "none";
        this.input.setAttribute("aria-expanded", "false");
    }

    selectOption(value) {
        this.input.value = value;
        this.input.setAttribute("aria-expanded", "false");
        this.input.setAttribute("aria-activedescendant", "");
        this.hideDropdown();
    }

    handleOutsideClick(e) {
        if (!this.contains(e.target)) {
            this.hideDropdown();
        }
    }
}

customElements.define("custom-combobox", CustomCombobox);