/**
 * Web Component: Custom Snackbar
 *
 * How to use in Webflow:
 * 1. Add an "Embed" element inside Webflow.
 * 2. Paste the following HTML:
 *      <custom-snackbar message="Action completed!" type="success" duration="3000"></custom-snackbar>
 * 3. Modify the "message" attribute to change the displayed text.
 * 4. Modify the "type" attribute (options: success, error, warning, info).
 * 5. Modify the "duration" attribute (in milliseconds) to set how long the snackbar remains visible.
 * 6. Show the snackbar programmatically using:
 *      document.querySelector('custom-snackbar').showSnackbar();
 */

<script>
class CustomSnackbar extends HTMLElement {
    static get observedAttributes() {
        return ["message", "type", "duration"];
    }

    constructor() {
        super();
        this.attachShadow({ mode: "open" });

        this.snackbar = document.createElement("div");
        this.snackbar.classList.add("snackbar");

        this.messageElement = document.createElement("span");
        this.messageElement.classList.add("snackbar-message");

        this.closeButton = document.createElement("button");
        this.closeButton.classList.add("snackbar-close");
        this.closeButton.textContent = "×";
        this.closeButton.addEventListener("click", () => this.hideSnackbar());

        this.snackbar.appendChild(this.messageElement);
        this.snackbar.appendChild(this.closeButton);
        this.shadowRoot.appendChild(this.snackbar);

        this.updateSnackbar();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        this.updateSnackbar();
    }

    updateSnackbar() {
        const message = this.getAttribute("message") || "This is a snackbar.";
        const type = this.getAttribute("type") || "info";
        const duration = parseInt(this.getAttribute("duration")) || 3000;

        this.snackbar.className = `snackbar ${type}`;
        this.messageElement.textContent = message;

        if (this.autoHideTimeout) {
            clearTimeout(this.autoHideTimeout);
        }

        if (duration > 0) {
            this.autoHideTimeout = setTimeout(() => this.hideSnackbar(), duration);
        }
    }

    showSnackbar() {
        this.snackbar.classList.add("visible");

        const duration = parseInt(this.getAttribute("duration")) || 3000;
        if (duration > 0) {
            setTimeout(() => this.hideSnackbar(), duration);
        }
    }

    hideSnackbar() {
        this.snackbar.classList.remove("visible");
    }

    connectedCallback() {
        this.showSnackbar();
    }
}

const style = document.createElement("style");
style.textContent = `
    .snackbar {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--snackbar-bg, #323232);
        color: white;
        padding: 12px 16px;
        border-radius: var(--border-radius, 6px);
        font-size: var(--font-size, 16px);
        box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.3s ease-in-out, visibility 0.3s ease-in-out;
    }
    .snackbar.visible {
        opacity: 1;
        visibility: visible;
    }
    .snackbar.success { background: #28a745; }
    .snackbar.error { background: #dc3545; }
    .snackbar.warning { background: #ffc107; }
    .snackbar.info { background: #17a2b8; }
    .snackbar-close {
        background: none;
        border: none;
        font-size: 18px;
        cursor: pointer;
        margin-left: 10px;
        color: white;
    }
`;

document.head.appendChild(style);

customElements.define("custom-snackbar", CustomSnackbar);
</script>