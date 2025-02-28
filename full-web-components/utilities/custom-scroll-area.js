/**
 * Web Component: Custom Scroll Area
 *
 * How to use in Webflow:
 * 1. Add an "Embed" element inside Webflow.
 * 2. Paste the following HTML:
 *      <custom-scroll-area height="300px">
 *          <div slot="content">
 *              <p>Scrollable content goes here...</p>
 *              <p>More content...</p>
 *              <p>Even more content...</p>
 *          </div>
 *      </custom-scroll-area>
 * 3. Modify the "height" attribute to set the scrollable area's height.
 * 4. Wrap content inside `<div slot="content">` to make it scrollable.
 */
<script>
class CustomScrollArea extends HTMLElement {
    static get observedAttributes() {
        return ["height"];
    }

    constructor() {
        super();
        this.attachShadow({ mode: "open" });

        this.wrapper = document.createElement("div");
        this.wrapper.classList.add("scroll-area");

        this.contentSlot = document.createElement("slot");
        this.contentSlot.setAttribute("name", "content");

        this.wrapper.appendChild(this.contentSlot);

        const style = document.createElement("style");
        style.textContent = `
            .scroll-area {
                overflow-y: auto;
                border: 1px solid var(--input-border, #ccc);
                border-radius: var(--border-radius, 6px);
                padding: 10px;
                max-height: ${this.getAttribute("height") || "300px"};
            }
            .scroll-area::-webkit-scrollbar {
                width: 8px;
            }
            .scroll-area::-webkit-scrollbar-thumb {
                background: var(--primary-color, #0073e6);
                border-radius: 4px;
            }
            .scroll-area::-webkit-scrollbar-thumb:hover {
                background: var(--primary-hover, #005bb5);
            }
        `;

        this.shadowRoot.appendChild(style);
        this.shadowRoot.appendChild(this.wrapper);
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "height") {
            this.wrapper.style.maxHeight = newValue;
        }
    }
}

customElements.define("custom-scroll-area", CustomScrollArea);
</script>