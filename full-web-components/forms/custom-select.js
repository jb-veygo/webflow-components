// Placeholder for custom-select.js
/**
 * Web Component: Custom Select Dropdown
 *
 * How to use in Webflow:
 * 1. Add an "Embed" element inside Webflow.
 * 2. Paste the following HTML:
 *      <custom-select options='["Option 1", "Option 2", "Option 3"]' placeholder="Choose an option"></custom-select>
 * 3. Modify the "options" attribute with an array of choices.
 * 4. Listen for selection changes using:
 *      document.querySelector('custom-select').addEventListener('selection-change', (e) => {
 *          console.log('Selected value:', e.detail.selected);
 *      });
 */

<script> 
class CustomSelect extends HTMLElement {
    static get observedAttributes() {
        return ["options", "placeholder"];
    }

    constructor() {
        super();
        this.attachShadow({ mode: "open" });

        this.wrapper = document.createElement("div");
        this.wrapper.classList.add("select-wrapper");

        this.selectBox = document.createElement("div");
        this.selectBox.classList.add("select-box");
        this.selectBox.textContent = this.getAttribute("placeholder") || "Select an option";
        this.selectBox.addEventListener("click", () => this.toggleDropdown());

        this.dropdown = document.createElement("div");
        this.dropdown.classList.add("dropdown");

        this.selectedValue = null;
        this.updateOptions();

        const style = document.createElement("style");
        style.textContent = `
            .select-wrapper {
                position: relative;
                width: 100%;
                border: 1px solid var(--input-border, #ccc);
                border-radius: var(--border-radius, 6px);
                font-size: var(--font-size, 16px);
                cursor: pointer;
                background: white;
            }
            .select-box {
                padding: 8px 12px;
                background: white;
            }
            .dropdown {
                display: none;
                position: absolute;
                width: 100%;
                background: white;
                border: 1px solid var(--input-border, #ccc);
                border-radius: var(--border-radius, 6px);
                box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
                z-index: 100;
            }
            .dropdown.visible {
                display: block;
            }
            .option {
                padding: 8px 12px;
                cursor: pointer;
            }
            .option:hover {
                background: var(--primary-hover, #e2e6ea);
            }
        `;

        this.shadowRoot.appendChild(style);
        this.shadowRoot.appendChild(this.wrapper);
        this.wrapper.appendChild(this.selectBox);
        this.wrapper.appendChild(this.dropdown);
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "options" || name === "placeholder") {
            this.updateOptions();
        }
    }

    updateOptions() {
        this.dropdown.innerHTML = "";
        const options = JSON.parse(this.getAttribute("options") || "[]");

        options.forEach(optionText => {
            const option = document.createElement("div");
            option.classList.add("option");
            option.textContent = optionText;
            option.addEventListener("click", () => this.selectOption(optionText));
            this.dropdown.appendChild(option);
        });
    }

    toggleDropdown() {
        this.dropdown.classList.toggle("visible");
    }

    selectOption(value) {
        this.selectedValue = value;
        this.selectBox.textContent = value;
        this.dropdown.classList.remove("visible");

        this.dispatchEvent(new CustomEvent("selection-change", {
            detail: { selected: value },
            bubbles: true
        }));
    }
}

customElements.define("custom-select", CustomSelect);
</script>