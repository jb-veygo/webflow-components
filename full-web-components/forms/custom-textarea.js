/**
 * Web Component: Custom Textarea
 *
 * How to use in Webflow:
 * 1. Add an "Embed" element inside Webflow.
 * 2. Paste the following HTML:
 *      <custom-textarea placeholder="Enter text here..." rows="4"></custom-textarea>
 * 3. Modify the "placeholder" attribute to change the input hint text.
 * 4. Modify the "rows" attribute to change the height.
 * 5. Listen for text changes using:
 *      document.querySelector('custom-textarea').addEventListener('text-change', (e) => {
 *          console.log('Textarea content:', e.detail.value);
 *      });
 */

<script>
class CustomTextarea extends HTMLElement {
    static get observedAttributes() {
        return ["placeholder", "rows"];
    }

    constructor() {
        super();
        this.attachShadow({ mode: "open" });

        this.wrapper = document.createElement("div");
        this.wrapper.classList.add("textarea-wrapper");

        this.textarea = document.createElement("textarea");
        this.textarea.classList.add("custom-textarea");
        this.textarea.setAttribute("placeholder", this.getAttribute("placeholder") || "Enter text...");
        this.textarea.setAttribute("rows", this.getAttribute("rows") || "4");

        this.textarea.addEventListener("input", () => this.handleTextChange());

        const style = document.createElement("style");
        style.textContent = `
            .textarea-wrapper {
                width: 100%;
                display: flex;
                flex-direction: column;
            }
            .custom-textarea {
                width: 100%;
                padding: 10px;
                border: 1px solid var(--input-border, #ccc);
                border-radius: var(--border-radius, 6px);
                font-size: var(--font-size, 16px);
                resize: vertical;
                outline: none;
            }
            .custom-textarea:focus {
                border-color: var(--primary-color, #0073e6);
                box-shadow: 0 0 3px var(--primary-color, #0073e6);
            }
        `;

        this.shadowRoot.appendChild(style);
        this.shadowRoot.appendChild(this.wrapper);
        this.wrapper.appendChild(this.textarea);
    }

    handleTextChange() {
        this.dispatchEvent(new CustomEvent("text-change", {
            detail: { value: this.textarea.value },
            bubbles: true
        }));
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "placeholder") {
            this.textarea.setAttribute("placeholder", newValue);
        } else if (name === "rows") {
            this.textarea.setAttribute("rows", newValue);
        }
    }
}

customElements.define("custom-textarea", CustomTextarea);
</script>