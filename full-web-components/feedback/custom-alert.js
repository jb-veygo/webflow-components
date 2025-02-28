/**
 * Web Component: Custom Alert
 *
 * How to use in Webflow:
 * 1. Add an "Embed" element inside Webflow.
 * 2. Paste the following HTML:
 *      <custom-alert type="success" message="Operation completed successfully!" auto-close="5000"></custom-alert>
 * 3. Modify the "type" attribute to set the alert type (options: success, error, warning, info).
 * 4. Modify the "message" attribute to change the alert message.
 * 5. Modify the "auto-close" attribute (in milliseconds) to automatically hide the alert.
 * 6. Close the alert manually using:
 *      document.querySelector('custom-alert').closeAlert();
 */

<script>
class CustomAlert extends HTMLElement {
    static get observedAttributes() {
        return ["type", "message", "auto-close"];
    }

    constructor() {
        super();
        this.attachShadow({ mode: "open" });

        this.wrapper = document.createElement("div");
        this.wrapper.classList.add("alert");

        this.messageElement = document.createElement("span");
        this.messageElement.classList.add("alert-message");

        this.closeButton = document.createElement("button");
        this.closeButton.classList.add("alert-close");
        this.closeButton.textContent = "×";
        this.closeButton.addEventListener("click", () => this.closeAlert());

        this.wrapper.appendChild(this.messageElement);
        this.wrapper.appendChild(this.closeButton);
        this.shadowRoot.appendChild(this.wrapper);

        this.updateAlert();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        this.updateAlert();
    }

    updateAlert() {
        const type = this.getAttribute("type") || "info";
        const message = this.getAttribute("message") || "This is an alert.";
        const autoClose = parseInt(this.getAttribute("auto-close"));

        this.wrapper.className = `alert ${type}`;
        this.messageElement.textContent = message;

        if (autoClose) {
            setTimeout(() => this.closeAlert(), autoClose);
        }
    }

    closeAlert() {
        this.wrapper.style.opacity = "0";
        setTimeout(() => this.remove(), 300);
    }

    connectedCallback() {
        this.wrapper.style.opacity = "1";
    }
}

const style = document.createElement("style");
style.textContent = `
    .alert {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 16px;
        border-radius: var(--border-radius, 6px);
        font-size: var(--font-size, 16px);
        box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
        transition: opacity 0.3s ease-in-out;
    }
    .alert.success { background: #d4edda; color: #155724; }
    .alert.error { background: #f8d7da; color: #721c24; }
    .alert.warning { background: #fff3cd; color: #856404; }
    .alert.info { background: #d1ecf1; color: #0c5460; }
    .alert-close {
        background: none;
        border: none;
        font-size: 18px;
        cursor: pointer;
        margin-left: 10px;
    }
`;

document.head.appendChild(style);

customElements.define("custom-alert", CustomAlert);
</script>