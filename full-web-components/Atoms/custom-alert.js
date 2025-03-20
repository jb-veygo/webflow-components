class CustomAlert extends HTMLElement {
    static get observedAttributes() {
        return ["type", "title", "message", "closeable"];
    }

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.type = this.getAttribute("type") || "info";
        this.title = this.getAttribute("title") || "Alert";
        this.message = this.getAttribute("message") || "Default alert message";
        this.closeable = this.hasAttribute("closeable");
        this.render();
    }

    connectedCallback() {
        if (this.closeable) {
            this.shadowRoot.querySelector(".alert-close").addEventListener("click", () => this.remove());
        }
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            this.closeable = this.hasAttribute("closeable");
            this[name] = newValue;
            this.render();
        }
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                .alert {
                    display: flex;
                    align-items: center;
                    padding: 12px;
                    border-radius: 6px;
                    font-size: 14px;
                    font-weight: 500;
                    gap: 10px;
                    margin-bottom: 10px;
                }
                .alert-icon {
                    width: 20px;
                    height: 20px;
                }
                .alert-close {
                    margin-left: auto;
                    background: none;
                    border: none;
                    cursor: pointer;
                    font-size: 16px;
                }
                .alert-content {
                    display: flex;
                    flex-direction: column;
                }
                .alert-title {
                    font-weight: bold;
                }
                .alert-message {
                    margin-top: 4px;
                }
                .alert.info {
                    background-color: #dbeafe;
                    color: #1e40af;
                }
                .alert.success {
                    background-color: #d1fae5;
                    color: #047857;
                }
                .alert.warning {
                    background-color: #fef3c7;
                    color: #b45309;
                }
                .alert.error {
                    background-color: #fee2e2;
                    color: #b91c1c;
                }
            </style>
            <div class="alert ${this.type}">
                <span class="alert-icon">⚠️</span>
                <div class="alert-content">
                    <div class="alert-title">${this.title}</div>
                    <div class="alert-message">${this.message}</div>
                </div>
                ${this.closeable ? '<button class="alert-close">✖</button>' : ''}
            </div>
        `;
    }
}

customElements.define("custom-alert", CustomAlert);
