class CustomLabel extends HTMLElement {
    static get observedAttributes() {
        return ["for"];
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

        // Updated ShadCN UI label styles
        const style = document.createElement("style");
        style.textContent = `
            .custom-label {
                display: inline-block;
                font-size: 0.875rem; /* 14px */
                font-weight: 500;
                color: #374151; /* Slate Gray */
                user-select: none;
            }
        `;

        this.shadowRoot.appendChild(style);
        this.shadowRoot.appendChild(this.label);
        this.shadowRoot.appendChild(this.helpText);
    }

    attributeChangedCallback() {
        this.updateAttributes();
    }

    updateAttributes() {
        const forAttr = this.getAttribute("for");
        if (forAttr) {
            this.label.setAttribute("for", forAttr);
        } else {
            this.label.removeAttribute("for");
        }
        
        const variant = this.getAttribute("variant") || "default";
        const helpText = this.getAttribute("help") || "";

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