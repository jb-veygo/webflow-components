/**
 * Web Component: Custom Tooltip
 *
 * How to use in Webflow:
 * 1. Add an "Embed" element inside Webflow.
 * 2. Paste the following HTML:
 *      <custom-tooltip text="Hover over me!" position="top">
 *          <span slot="tooltip-content">This is a tooltip message.</span>
 *      </custom-tooltip>
 * 3. Modify the "text" attribute to change the tooltip trigger.
 * 4. Modify the "position" attribute to change tooltip placement (options: top, bottom, left, right).
 * 5. Add custom tooltip content inside the `<span slot="tooltip-content">`.
 */

<script>
class CustomTooltip extends HTMLElement {
    static get observedAttributes() {
        return ["text", "position"];
    }

    constructor() {
        super();
        this.attachShadow({ mode: "open" });

        this.wrapper = document.createElement("div");
        this.wrapper.classList.add("tooltip-wrapper");

        this.trigger = document.createElement("span");
        this.trigger.classList.add("tooltip-trigger");
        this.trigger.textContent = this.getAttribute("text") || "Hover over me!";

        this.tooltip = document.createElement("div");
        this.tooltip.classList.add("tooltip-box");
        this.tooltip.setAttribute("data-position", this.getAttribute("position") || "top");
        this.tooltip.style.display = "none";

        this.contentSlot = document.createElement("slot");
        this.contentSlot.setAttribute("name", "tooltip-content");

        this.tooltip.appendChild(this.contentSlot);
        this.wrapper.appendChild(this.trigger);
        this.wrapper.appendChild(this.tooltip);

        this.trigger.addEventListener("mouseenter", () => this.showTooltip());
        this.trigger.addEventListener("mouseleave", () => this.hideTooltip());

        const style = document.createElement("style");
        style.textContent = `
            .tooltip-wrapper {
                display: inline-block;
                position: relative;
            }
            .tooltip-trigger {
                cursor: pointer;
                text-decoration: underline;
                color: var(--primary-color, #0073e6);
            }
            .tooltip-box {
                position: absolute;
                background: var(--tooltip-bg, black);
                color: white;
                padding: 6px 10px;
                border-radius: var(--border-radius, 4px);
                font-size: var(--font-size, 14px);
                white-space: nowrap;
                z-index: 10;
            }
            .tooltip-box[data-position="top"] {
                bottom: 100%;
                left: 50%;
                transform: translateX(-50%);
                margin-bottom: 5px;
            }
            .tooltip-box[data-position="bottom"] {
                top: 100%;
                left: 50%;
                transform: translateX(-50%);
                margin-top: 5px;
            }
            .tooltip-box[data-position="left"] {
                right: 100%;
                top: 50%;
                transform: translateY(-50%);
                margin-right: 5px;
            }
            .tooltip-box[data-position="right"] {
                left: 100%;
                top: 50%;
                transform: translateY(-50%);
                margin-left: 5px;
            }
        `;

        this.shadowRoot.appendChild(style);
        this.shadowRoot.appendChild(this.wrapper);
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "text") {
            this.trigger.textContent = newValue;
        } else if (name === "position") {
            this.tooltip.setAttribute("data-position", newValue);
        }
    }

    showTooltip() {
        this.tooltip.style.display = "block";
    }

    hideTooltip() {
        this.tooltip.style.display = "none";
    }
}

customElements.define("custom-tooltip", CustomTooltip);
</script>