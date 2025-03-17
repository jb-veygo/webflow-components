class CustomLabel extends HTMLElement {
    static get observedAttributes() {
        return ["for", "variant", "help"];
    }

    constructor() {
        super();
        this.attachShadow({ mode: "open" });

        this.wrapper = document.createElement("div");
        this.wrapper.classList.add("label-wrapper");

        this.label = document.createElement("label");
        this.label.classList.add("custom-label");
        this.label.innerHTML = `<slot></slot>`;

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
                font-size: var(--font-body, 14px);
                color: var(--color-text, #333);
                font-weight: 500;
                display: inline-block;
            }

            /* Variants */
            .custom-label.bold {
                font-weight: bold;
            }

            .custom-label.muted {
                color: var(--color-muted, #666);
            }

            .custom-label.required::after {
                content: " *";
                color: var(--color-danger, red);
            }

            /* Help Text */
            .help-text {
                font-size: 12px;
                color: var(--color-muted, #666);
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

        if (helpText) {
            this.helpText.textContent = helpText;
            this.helpText.style.display = "block";
        } else {
            this.helpText.style.display = "none";
        }
    }
}

customElements.define("custom-label", CustomLabel);