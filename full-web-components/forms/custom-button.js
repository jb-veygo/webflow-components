/**
 * Web Component: Custom Button
 *
 * How to use in Webflow:
 * 1. Add an "Embed" element inside Webflow.
 * 2. Paste the following HTML:
 *      <custom-button label="Click Me"></custom-button>
 * 3. You can change the label by modifying the "label" attribute.
 * 4. Listen for the button click event using:
 *      document.querySelector('custom-button').addEventListener('button-click', () => {
 *          console.log('Button clicked!');
 *      });
 */

<script>
class CustomButton extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });

        this.button = document.createElement("button");
        this.button.classList.add("custom-button");
        this.button.textContent = this.getAttribute("label") || "Click me";

        this.button.addEventListener("click", () => 
            this.dispatchEvent(new Event("button-click", { bubbles: true }))
        );

        const style = document.createElement("style");
        style.textContent = `
            .custom-button {
                background: var(--primary-color, #0073e6);
                color: white;
                padding: 10px 20px;
                border: none;
                border-radius: var(--border-radius, 6px);
                cursor: pointer;
                font-size: var(--font-size, 16px);
            }
            .custom-button:hover {
                background: var(--primary-hover, #005bb5);
            }
        `;

        this.shadowRoot.appendChild(style);
        this.shadowRoot.appendChild(this.button);
    }
}

customElements.define("custom-button", CustomButton);
</script>