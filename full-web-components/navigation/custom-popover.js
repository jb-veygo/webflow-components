/**
 * Web Component: Custom Popover
 *
 * How to use in Webflow:
 * 1. Add an "Embed" element inside Webflow.
 * 2. Paste the following HTML:
 *      <custom-popover trigger-text="Open Popover">
 *          <div slot="content">This is the popover content.</div>
 *      </custom-popover>
 * 3. Modify the "trigger-text" attribute to change the button label.
 * 4. Add content inside the component using `<div slot="content">`.
 * 5. Listen for popover events using:
 *      document.querySelector('custom-popover').addEventListener('popover-toggle', (e) => {
 *          console.log('Popover state:', e.detail.open);
 *      });
 */

<script>
class CustomPopover extends HTMLElement {
    static get observedAttributes() {
        return ["trigger-text"];
    }

    constructor() {
        super();
        this.attachShadow({ mode: "open" });

        this.wrapper = document.createElement("div");
        this.wrapper.classList.add("popover-wrapper");

        this.triggerButton = document.createElement("button");
        this.triggerButton.classList.add("popover-trigger");
        this.triggerButton.textContent = this.getAttribute("trigger-text") || "Open Popover";
        this.triggerButton.addEventListener("click", () => this.togglePopover());

        this.popoverContent = document.createElement("div");
        this.popoverContent.classList.add("popover-content");

        const slot = document.createElement("slot");
        slot.setAttribute("name", "content");

        this.popoverContent.appendChild(slot);
        this.wrapper.appendChild(this.triggerButton);
        this.wrapper.appendChild(this.popoverContent);

        const style = document.createElement("style");
        style.textContent = `
            .popover-wrapper {
                position: relative;
                display: inline-block;
            }
            .popover-trigger {
                background: var(--primary-color, #0073e6);
                color: white;
                padding: 8px 16px;
                border: none;
                border-radius: var(--border-radius, 6px);
                cursor: pointer;
            }
            .popover-content {
                display: none;
                position: absolute;
                top: 100%;
                left: 50%;
                transform: translateX(-50%);
                background: white;
                border: 1px solid var(--input-border, #ccc);
                border-radius: var(--border-radius, 6px);
                box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
                padding: 10px;
                min-width: 200px;
                z-index: 10;
            }
            .popover-content.visible {
                display: block;
            }
        `;

        this.shadowRoot.appendChild(style);
        this.shadowRoot.appendChild(this.wrapper);
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "trigger-text") {
            this.triggerButton.textContent = newValue;
        }
    }

    togglePopover() {
        const isOpen = this.popoverContent.classList.toggle("visible");
        this.dispatchEvent(new CustomEvent("popover-toggle", {
            detail: { open: isOpen },
            bubbles: true
        }));
    }
}

customElements.define("custom-popover", CustomPopover);
</script>