/**
 * Web Component: Custom Dashboard Widget
 *
 * How to use in Webflow:
 * 1. Add an "Embed" element inside Webflow.
 * 2. Paste the following HTML:
 *      <custom-dashboard-widget title="Revenue" value="$12,345" icon="💰"></custom-dashboard-widget>
 * 3. Modify the "title" attribute to change the widget title.
 * 4. Modify the "value" attribute to set the displayed value.
 * 5. Modify the "icon" attribute to add an emoji or symbol to the widget.
 */

<script>
class CustomDashboardWidget extends HTMLElement {
    static get observedAttributes() {
        return ["title", "value", "icon"];
    }

    constructor() {
        super();
        this.attachShadow({ mode: "open" });

        this.wrapper = document.createElement("div");
        this.wrapper.classList.add("widget");

        this.icon = document.createElement("span");
        this.icon.classList.add("widget-icon");
        this.icon.textContent = this.getAttribute("icon") || "📊";

        this.title = document.createElement("h3");
        this.title.classList.add("widget-title");
        this.title.textContent = this.getAttribute("title") || "Widget Title";

        this.value = document.createElement("p");
        this.value.classList.add("widget-value");
        this.value.textContent = this.getAttribute("value") || "0";

        this.wrapper.appendChild(this.icon);
        this.wrapper.appendChild(this.title);
        this.wrapper.appendChild(this.value);

        const style = document.createElement("style");
        style.textContent = `
            .widget {
                display: flex;
                align-items: center;
                background: var(--widget-bg, #f8f9fa);
                padding: 16px;
                border-radius: var(--border-radius, 10px);
                box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
                width: 100%;
                max-width: 300px;
                text-align: left;
            }
            .widget-icon {
                font-size: 24px;
                margin-right: 12px;
            }
            .widget-title {
                font-size: var(--font-size, 16px);
                font-weight: bold;
                margin: 0;
            }
            .widget-value {
                font-size: var(--font-size, 18px);
                color: var(--primary-color, #0073e6);
                margin: 0;
            }
        `;

        this.shadowRoot.appendChild(style);
        this.shadowRoot.appendChild(this.wrapper);
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "title") {
            this.title.textContent = newValue;
        } else if (name === "value") {
            this.value.textContent = newValue;
        } else if (name === "icon") {
            this.icon.textContent = newValue;
        }
    }
}

customElements.define("custom-dashboard-widget", CustomDashboardWidget);
</script>