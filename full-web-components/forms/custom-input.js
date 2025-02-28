/**
 * Web Component: Custom Input
 *
 * How to use in Webflow:
 * 1. Add an "Embed" element inside Webflow.
 * 2. Paste the following HTML:
 *      <custom-input type="text" placeholder="Enter text"></custom-input>
 * 3. You can change the type by modifying the "type" attribute (e.g., "email", "password").
 * 4. Listen for the input change event using:
 *      document.querySelector('custom-input').addEventListener('input-change', (e) => {
 *          console.log('Input value:', e.detail.value);
 *      });
 */

<script>
class CustomInput extends HTMLElement {
    static get observedAttributes() { return ["placeholder", "value", "type"]; }

    constructor() {
        super();
        this.attachShadow({ mode: "open" });

        this.input = document.createElement("input");
        this.input.classList.add("custom-input");
        this.input.setAttribute("type", this.getAttribute("type") || "text");
        this.input.setAttribute("placeholder", this.getAttribute("placeholder") || "");

        this.input.addEventListener("input", () => 
            this.dispatchEvent(new CustomEvent("input-change", {
                detail: { value: this.input.value },
                bubbles: true
            }))
        );

        const style = document.createElement("style");
        style.textContent = `
            .custom-input {
                width: 100%;
                padding: 8px 12px;
                border: 1px solid var(--input-border, #ccc);
                border-radius: var(--border-radius, 6px);
                font-size: var(--font-size, 16px);
                outline: none;
            }
            .custom-input:focus {
                border-color: var(--primary-color, #0073e6);
                box-shadow: 0 0 3px var(--primary-color, #0073e6);
            }
        `;

        this.shadowRoot.appendChild(style);
        this.shadowRoot.appendChild(this.input);
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "placeholder") {
            this.input.setAttribute("placeholder", newValue);
        } else if (name === "value") {
            this.input.value = newValue;
        } else if (name === "type") {
            this.input.setAttribute("type", newValue);
        }
    }
}

customElements.define("custom-input", CustomInput);
</script>