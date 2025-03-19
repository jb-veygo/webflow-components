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
                background: white;
                padding: 1rem;
                border-radius: 0.5rem;
                border: 1px solid #e5e7eb;
                transition: all 0.3s ease-in-out;
            }

            .custom-card.shadowed {
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            }

            .custom-card.bordered {
                border: 2px solid #1e40af;
            }

            .card-header {
                font-size: 1.25rem;
                font-weight: 600;
                margin-bottom: 0.75rem;
                color: #1e293b;
            }

            .card-body {
                font-size: 1rem;
                color: #374151;
            }

            .card-footer {
                margin-top: 1rem;
                text-align: right;
            }
        `;

        this.shadowRoot.appendChild(style);
        this.shadowRoot.appendChild(this.wrapper);
        console.log("CustomCard component loaded successfully.");
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