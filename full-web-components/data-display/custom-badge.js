/**
 * Web Component: Custom Badge
 *
 * How to use in Webflow:
 * 1. Add an "Embed" element inside Webflow.
 * 2. Paste the following HTML:
 *      <custom-badge label="New" color="red"></custom-badge>
 * 3. Modify the "label" attribute to change the text inside the badge.
 * 4. Modify the "color" attribute to change the badge background color.
 * 5. Style further using CSS variables:
 *      --badge-text-color: #fff;
 *      --badge-border-radius: 12px;
 */
<script>
class CustomBadge extends HTMLElement {
    static get observedAttributes() {
        return ["label", "color"];
    }

    constructor() {
        super();
        this.attachShadow({ mode: "open" });

        this.badge = document.createElement("span");
        this.badge.classList.add("badge");
        this.badge.textContent = this.getAttribute("label") || "Badge";

        this.updateColor();

        const style = document.createElement("style");
        style.textContent = `
            .badge {
                display: inline-block;
                padding: 4px 10px;
                font-size: var(--font-size, 12px);
                font-weight: bold;
                color: var(--badge-text-color, #fff);
                background: var(--badge-bg, red);
                border-radius: var(--badge-border-radius, 12px);
            }
        `;

        this.shadowRoot.appendChild(style);
        this.shadowRoot.appendChild(this.badge);
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "label") {
            this.badge.textContent = newValue;
        } else if (name === "color") {
            this.updateColor();
        }
    }

    updateColor() {
        const color = this.getAttribute("color") || "red";
        this.badge.style.backgroundColor = color;
    }
}

customElements.define("custom-badge", CustomBadge);
</script>