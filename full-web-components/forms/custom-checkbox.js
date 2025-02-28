/**
 * Web Component: Custom Checkbox
 *
 * How to use in Webflow:
 * 1. Add an "Embed" element inside Webflow.
 * 2. Paste the following HTML:
 *      <custom-checkbox label="Accept Terms"></custom-checkbox>
 * 3. You can change the label by modifying the "label" attribute.
 * 4. Listen for the checkbox change event using:
 *      document.querySelector('custom-checkbox').addEventListener('checkbox-change', (e) => {
 *          console.log('Checkbox checked:', e.detail.checked);
 *      });
 */

<script>
class CustomCheckbox extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });

        this.wrapper = document.createElement("label");
        this.wrapper.classList.add("checkbox-wrapper");

        this.input = document.createElement("input");
        this.input.setAttribute("type", "checkbox");

        this.checkboxMark = document.createElement("span");
        this.checkboxMark.classList.add("checkbox-mark");

        this.label = document.createElement("span");
        this.label.classList.add("checkbox-label");
        this.label.textContent = this.getAttribute("label") || "";

        this.wrapper.appendChild(this.input);
        this.wrapper.appendChild(this.checkboxMark);
        this.wrapper.appendChild(this.label);

        this.input.addEventListener("change", () => {
            this.dispatchEvent(new CustomEvent("checkbox-change", {
                detail: { checked: this.input.checked },
                bubbles: true
            }));
        });

        const style = document.createElement("style");
        style.textContent = `
            .checkbox-wrapper {
                display: flex;
                align-items: center;
                cursor: pointer;
                gap: 8px;
                font-size: var(--font-size, 16px);
            }
            input {
                display: none;
            }
            .checkbox-mark {
                width: 16px;
                height: 16px;
                border: 2px solid var(--primary-color, #0073e6);
                display: inline-block;
                border-radius: 4px;
                position: relative;
            }
            .checkbox-mark::after {
                content: "";
                position: absolute;
                display: none;
                left: 4px;
                top: 1px;
                width: 5px;
                height: 10px;
                border: solid var(--primary-color, #0073e6);
                border-width: 0 2px 2px 0;
                transform: rotate(45deg);
            }
            input:checked + .checkbox-mark::after {
                display: block;
            }
        `;

        this.shadowRoot.appendChild(style);
        this.shadowRoot.appendChild(this.wrapper);
    }
}

customElements.define("custom-checkbox", CustomCheckbox);
</script>