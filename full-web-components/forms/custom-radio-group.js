/**
 * Web Component: Custom Radio Group
 *
 * How to use in Webflow:
 * 1. Add an "Embed" element inside Webflow.
 * 2. Paste the following HTML:
 *      <custom-radio-group name="example" options='["Option 1", "Option 2", "Option 3"]'></custom-radio-group>
 * 3. Modify the "name" attribute to set the group name (important for selecting one at a time).
 * 4. Modify the "options" attribute with an array of choices.
 * 5. Listen for selection changes using:
 *      document.querySelector('custom-radio-group').addEventListener('selection-change', (e) => {
 *          console.log('Selected option:', e.detail.selected);
 *      });
 */
<script>
class CustomRadioGroup extends HTMLElement {
    static get observedAttributes() {
        return ["options", "name"];
    }

    constructor() {
        super();
        this.attachShadow({ mode: "open" });

        this.wrapper = document.createElement("div");
        this.wrapper.classList.add("radio-group");

        this.name = this.getAttribute("name") || `radio-${Date.now()}`;
        this.options = JSON.parse(this.getAttribute("options") || "[]");

        this.renderOptions();

        const style = document.createElement("style");
        style.textContent = `
            .radio-group {
                display: flex;
                flex-direction: column;
                gap: 8px;
            }
            .radio-option {
                display: flex;
                align-items: center;
                gap: 8px;
                font-size: var(--font-size, 16px);
                cursor: pointer;
            }
            input {
                appearance: none;
                width: 16px;
                height: 16px;
                border: 2px solid var(--primary-color, #0073e6);
                border-radius: 50%;
                display: inline-block;
                position: relative;
            }
            input:checked::before {
                content: "";
                width: 8px;
                height: 8px;
                background: var(--primary-color, #0073e6);
                border-radius: 50%;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
            }
        `;

        this.shadowRoot.appendChild(style);
        this.shadowRoot.appendChild(this.wrapper);
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "options" || name === "name") {
            this.name = this.getAttribute("name") || `radio-${Date.now()}`;
            this.options = JSON.parse(this.getAttribute("options") || "[]");
            this.renderOptions();
        }
    }

    renderOptions() {
        this.wrapper.innerHTML = "";
        this.options.forEach(optionText => {
            const label = document.createElement("label");
            label.classList.add("radio-option");

            const input = document.createElement("input");
            input.setAttribute("type", "radio");
            input.setAttribute("name", this.name);
            input.setAttribute("value", optionText);
            input.addEventListener("change", () => this.handleSelection(optionText));

            const text = document.createElement("span");
            text.textContent = optionText;

            label.appendChild(input);
            label.appendChild(text);
            this.wrapper.appendChild(label);
        });
    }

    handleSelection(value) {
        this.dispatchEvent(new CustomEvent("selection-change", {
            detail: { selected: value },
            bubbles: true
        }));
    }
}

customElements.define("custom-radio-group", CustomRadioGroup);
</script>