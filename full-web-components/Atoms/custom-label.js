class CustomLabel extends HTMLElement {
    static get observedAttributes() {
        return ["for", "variant", "help", "hidden"];
    }

    constructor() {
        super();
        this.attachShadow({ mode: "open" });

        this.wrapper = document.createElement("div");
        this.wrapper.classList.add("label-wrapper");

        this.label = document.createElement("label");
        this.label.classList.add("custom-label");
        this.label.innerHTML = `<slot></slot>`;
        this.label.setAttribute("role", "label");
        this.label.setAttribute("aria-hidden", this.hasAttribute("hidden") ? "true" : "false");

        this.helpText = document.createElement("span");
        this.helpText.classList.add("help-text");
        this.helpText.style.display = "none";

        this.updateAttributes();

        const style = document.createElement("style");
        style.textContent = `
            .label-wrapper {
                display: flex;
                flex-direction: column;
                gap: var(--spacing-xs);
            }

            .custom-label {
                font-size: 14px;
                color: #333;
                font-weight: 500;
                display: inline-block;
            }

            /* Variants */
            .custom-label.bold {
                font-weight: bold;
            }

            .custom-label.muted {
                color: #666;
            }

            .custom-label.required::after {
                content: " *";
                color: red;
            }

            /* Help Text */
            .help-text {
                font-size: 12px;
                color: #666;
            }
        `;

        this.wrapper.appendChild(this.label);
        this.wrapper.appendChild(this.helpText);
        this.shadowRoot.appendChild(style);
        this.shadowRoot.appendChild(this.wrapper);
    }

    attributeChangedCallback() {
        this.updateAttributes();
    }

    updateAttributes() {
        const forAttr = this.getAttribute("for") || "";
        const variant = this.getAttribute("variant") || "default";
        const helpText = this.getAttribute("help") || "";

        if (forAttr) {
            this.label.setAttribute("for", forAttr);
        }

        this.label.className = `custom-label ${variant}`;
        this.label.setAttribute("aria-hidden", this.hasAttribute("hidden") ? "true" : "false");

        if (helpText) {
            this.helpText.textContent = helpText;
            this.helpText.style.display = "block";
        } else {
            this.helpText.style.display = "none";
        }
    }
}

customElements.define("custom-label", CustomLabel);