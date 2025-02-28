/**
 * Web Component: Custom Multi-Select
 *
 * How to use in Webflow:
 * 1. Add an "Embed" element inside Webflow.
 * 2. Paste the following HTML:
 *      <custom-multi-select options='["Option 1", "Option 2", "Option 3"]'></custom-multi-select>
 * 3. Modify the "options" attribute with an array of choices.
 * 4. Listen for selection changes using:
 *      document.querySelector('custom-multi-select').addEventListener('selection-change', (e) => {
 *          console.log('Selected values:', e.detail.selected);
 *      });
 */

<script>
class CustomMultiSelect extends HTMLElement {
    static get observedAttributes() { return ["options"]; }

    constructor() {
        super();
        this.attachShadow({ mode: "open" });

        this.wrapper = document.createElement("div");
        this.wrapper.classList.add("multi-select");

        this.selectBox = document.createElement("div");
        this.selectBox.classList.add("select-box");
        this.selectBox.textContent = "Select options";
        this.selectBox.addEventListener("click", () => this.toggleDropdown());

        this.dropdown = document.createElement("div");
        this.dropdown.classList.add("dropdown");

        this.selectedValues = new Set();
        this.updateOptions();

        const style = document.createElement("style");
        style.textContent = `
            .multi-select {
                position: relative;
                width: 100%;
                border: 1px solid var(--input-border, #ccc);
                border-radius: var(--border-radius, 6px);
                font-size: var(--font-size, 16px);
                cursor: pointer;
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
            .option.selected {
                background: var(--primary-color, #0073e6);
                color: white;
            }
        `;

        this.shadowRoot.appendChild(style);
        this.shadowRoot.appendChild(this.wrapper);
        this.wrapper.appendChild(this.selectBox);
        this.wrapper.appendChild(this.dropdown);
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "options") {
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
            option.addEventListener("click", () => this.toggleSelection(optionText));
            this.dropdown.appendChild(option);
        });
    }

    toggleDropdown() {
        this.dropdown.classList.toggle("visible");
    }

    toggleSelection(value) {
        if (this.selectedValues.has(value)) {
            this.selectedValues.delete(value);
        } else {
            this.selectedValues.add(value);
        }
        this.updateSelectedDisplay();
        this.dispatchEvent(new CustomEvent("selection-change", {
            detail: { selected: Array.from(this.selectedValues) },
            bubbles: true
        }));
    }

    updateSelectedDisplay() {
        const selectedArray = Array.from(this.selectedValues);
        this.selectBox.textContent = selectedArray.length > 0 ? selectedArray.join(", ") : "Select options";
        this.dropdown.querySelectorAll(".option").forEach(option => {
            if (selectedArray.includes(option.textContent)) {
                option.classList.add("selected");
            } else {
                option.classList.remove("selected");
            }
        });
    }
}

customElements.define("custom-multi-select", CustomMultiSelect);
</script>
