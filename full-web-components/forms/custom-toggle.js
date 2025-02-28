
/**
 * Web Component: Custom Toggle Switch
 *
 * How to use in Webflow:
 * 1. Add an "Embed" element inside Webflow.
 * 2. Paste the following HTML:
 *      <custom-toggle label="Enable feature"></custom-toggle>
 * 3. Modify the "label" attribute to change the toggle description.
 * 4. Listen for toggle state changes using:
 *      document.querySelector('custom-toggle').addEventListener('toggle-change', (e) => {
 *          console.log('Toggle state:', e.detail.checked);
 *      });
 */

<script>
class CustomToggle extends HTMLElement {
    static get observedAttributes() {
        return ["label"];
    }

    constructor() {
        super();
        this.attachShadow({ mode: "open" });

        this.wrapper = document.createElement("label");
        this.wrapper.classList.add("toggle-wrapper");

        this.input = document.createElement("input");
        this.input.setAttribute("type", "checkbox");

        this.switch = document.createElement("span");
        this.switch.classList.add("toggle-switch");

        this.label = document.createElement("span");
        this.label.classList.add("toggle-label");
        this.label.textContent = this.getAttribute("label") || "";

        this.wrapper.appendChild(this.input);
        this.wrapper.appendChild(this.switch);
        this.wrapper.appendChild(this.label);

        this.input.addEventListener("change", () => {
            this.dispatchEvent(new CustomEvent("toggle-change", {
                detail: { checked: this.input.checked },
                bubbles: true
            }));
        });

        const style = document.createElement("style");
        style.textContent = `
            .toggle-wrapper {
                display: flex;
                align-items: center;
                gap: 8px;
                font-size: var(--font-size, 16px);
                cursor: pointer;
            }
            input {
                display: none;
            }
            .toggle-switch {
                width: 40px;
                height: 20px;
                background: #ccc;
                border-radius: 20px;
                position: relative;
                transition: background 0.3s ease;
            }
            .toggle-switch::before {
                content: "";
                position: absolute;
                width: 18px;
                height: 18px;
                background: white;
                border-radius: 50%;
                top: 1px;
                left: 1px;
                transition: transform 0.3s ease;
            }
            input:checked + .toggle-switch {
                background: var(--primary-color, #0073e6);
            }
            input:checked + .toggle-switch::before {
                transform: translateX(20px);
            }
        `;

        this.shadowRoot.appendChild(style);
        this.shadowRoot.appendChild(this.wrapper);
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "label") {
            this.label.textContent = newValue;
        }
    }
}

customElements.define("custom-toggle", CustomToggle);
</script>