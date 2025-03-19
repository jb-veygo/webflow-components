class CustomCard extends HTMLElement {
    static get observedAttributes() {
        return ["variant"];
    }

    constructor() {
        super();
        this.attachShadow({ mode: "open" });

        this.wrapper = document.createElement("div");
        this.wrapper.classList.add("custom-card");

        // Header Slot
        this.header = document.createElement("div");
        this.header.classList.add("card-header");
        this.header.innerHTML = `<slot name="header"></slot>`;

        // Body Slot
        this.body = document.createElement("div");
        this.body.classList.add("card-body");
        this.body.innerHTML = `<slot></slot>`;

        // Footer Slot
        this.footer = document.createElement("div");
        this.footer.classList.add("card-footer");
        this.footer.innerHTML = `<slot name="footer"></slot>`;

        this.wrapper.appendChild(this.header);
        this.wrapper.appendChild(this.body);
        this.wrapper.appendChild(this.footer);

        this.updateAttributes();

        const style = document.createElement("style");
        style.textContent = `
            .custom-card {
                background: var(--color-background, white);
                padding: var(--spacing-lg);
                border-radius: var(--border-radius-md);
                border: 1px solid var(--color-border, #ddd);
                transition: all 0.3s ease-in-out;
            }

            .custom-card.shadowed {
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            }

            .custom-card.bordered {
                border: 2px solid var(--color-primary);
            }

            .card-header {
                font-size: var(--font-heading, 18px);
                font-weight: bold;
                margin-bottom: var(--spacing-md);
            }

            .card-body {
                font-size: var(--font-body, 16px);
                color: var(--color-text, #333);
            }

            .card-footer {
                margin-top: var(--spacing-md);
                text-align: right;
            }
        `;

        this.shadowRoot.appendChild(style);
        this.shadowRoot.appendChild(this.wrapper);
    }

    attributeChangedCallback() {
        this.updateAttributes();
    }

    updateAttributes() {
        const variant = this.getAttribute("variant") || "default";
        this.wrapper.className = `custom-card ${variant}`;
    }
}

customElements.define("custom-card", CustomCard);