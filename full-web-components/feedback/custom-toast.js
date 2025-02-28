/**
 * Web Component: Custom Toast Notification
 *
 * How to use in Webflow:
 * 1. Add an "Embed" element inside Webflow.
 * 2. Paste the following HTML:
 *      <custom-toast message="Item saved successfully!" type="success" duration="3000"></custom-toast>
 * 3. Modify the "message" attribute to change the displayed text.
 * 4. Modify the "type" attribute (options: success, error, warning, info).
 * 5. Modify the "duration" attribute (in milliseconds) to set how long the toast remains visible.
 * 6. Show the toast programmatically using:
 *      document.querySelector('custom-toast').showToast();
 */

<script>
class CustomToast extends HTMLElement {
    static get observedAttributes() {
        return ["message", "type", "duration"];
    }

    constructor() {
        super();
        this.attachShadow({ mode: "open" });

        this.toast = document.createElement("div");
        this.toast.classList.add("toast");

        this.messageElement = document.createElement("span");
        this.messageElement.classList.add("toast-message");

        this.closeButton = document.createElement("button");
        this.closeButton.classList.add("toast-close");
        this.closeButton.textContent = "×";
        this.closeButton.addEventListener("click", () => this.hideToast());

        this.toast.appendChild(this.messageElement);
        this.toast.appendChild(this.closeButton);
        this.shadowRoot.appendChild(this.toast);

        this.updateToast();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        this.updateToast();
    }

    updateToast() {
        const message = this.getAttribute("message") || "This is a toast notification.";
        const type = this.getAttribute("type") || "info";
        const duration = parseInt(this.getAttribute("duration")) || 3000;

        this.toast.className = `toast ${type}`;
        this.messageElement.textContent = message;

        if (this.autoHideTimeout) {
            clearTimeout(this.autoHideTimeout);
        }

        if (duration > 0) {
            this.autoHideTimeout = setTimeout(() => this.hideToast(), duration);
        }
    }

    showToast() {
        this.toast.classList.add("visible");

        const duration = parseInt(this.getAttribute("duration")) || 3000;
        if (duration > 0) {
            setTimeout(() => this.hideToast(), duration);
        }
    }

    hideToast() {
        this.toast.classList.remove("visible");
    }

    connectedCallback() {
        this.showToast();
    }
}

const style = document.createElement("style");
style.textContent = `
    .toast {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: var(--toast-bg, #323232);
        color: white;
        padding: 12px 16px;
        border-radius: var(--border-radius, 6px);
        font-size: var(--font-size, 16px);
        box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.3s ease-in-out, visibility 0.3s ease-in-out;
    }
    .toast.visible {
        opacity: 1;
        visibility: visible;
    }
    .toast.success { background: #28a745; }
    .toast.error { background: #dc3545; }
    .toast.warning { background: #ffc107; }
    .toast.info { background: #17a2b8; }
    .toast-close {
        background: none;
        border: none;
        font-size: 18px;
        cursor: pointer;
        margin-left: 10px;
        color: white;
    }
`;

document.head.appendChild(style);

customElements.define("custom-toast", CustomToast);
</script>