/**
 * Web Component: Custom Clipboard Copy
 *
 * How to use in Webflow:
 * 1. Add an "Embed" element inside Webflow.
 * 2. Paste the following HTML:
 *      <custom-clipboard-copy text="Copy this text"></custom-clipboard-copy>
 * 3. Modify the "text" attribute to set the content to be copied.
 * 4. Listen for the copy event using:
 *      document.querySelector('custom-clipboard-copy').addEventListener('copy-success', () => {
 *          console.log('Text copied successfully!');
 *      });
 */

<script>
class CustomClipboardCopy extends HTMLElement {
    static get observedAttributes() {
        return ["text"];
    }

    constructor() {
        super();
        this.attachShadow({ mode: "open" });

        this.button = document.createElement("button");
        this.button.classList.add("copy-button");
        this.button.textContent = "Copy";

        this.button.addEventListener("click", () => this.copyToClipboard());

        const style = document.createElement("style");
        style.textContent = `
            .copy-button {
                background: var(--primary-color, #0073e6);
                color: white;
                padding: 8px 16px;
                border: none;
                border-radius: var(--border-radius, 6px);
                cursor: pointer;
                font-size: var(--font-size, 16px);
            }
            .copy-button:hover {
                background: var(--primary-hover, #005bb5);
            }
        `;

        this.shadowRoot.appendChild(style);
        this.shadowRoot.appendChild(this.button);
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "text") {
            this.textToCopy = newValue;
        }
    }

    async copyToClipboard() {
        try {
            await navigator.clipboard.writeText(this.textToCopy || "");
            this.dispatchEvent(new CustomEvent("copy-success", { bubbles: true }));
            this.button.textContent = "Copied!";
            setTimeout(() => (this.button.textContent = "Copy"), 2000);
        } catch (err) {
            console.error("Failed to copy text:", err);
        }
    }
}

customElements.define("custom-clipboard-copy", CustomClipboardCopy);
</script>