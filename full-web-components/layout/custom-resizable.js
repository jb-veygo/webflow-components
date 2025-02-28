/**
 * Web Component: Custom Resizable Panel
 *
 * How to use in Webflow:
 * 1. Add an "Embed" element inside Webflow.
 * 2. Paste the following HTML:
 *      <custom-resizable min-width="200" max-width="800">
 *          <div slot="content">
 *              <p>Resizable content goes here.</p>
 *          </div>
 *      </custom-resizable>
 * 3. Modify the "min-width" and "max-width" attributes to set size limits.
 * 4. Resize the panel by dragging the right edge.
 */

<script>
class CustomResizable extends HTMLElement {
    static get observedAttributes() {
        return ["min-width", "max-width"];
    }

    constructor() {
        super();
        this.attachShadow({ mode: "open" });

        this.wrapper = document.createElement("div");
        this.wrapper.classList.add("resizable-wrapper");

        this.contentSlot = document.createElement("slot");
        this.contentSlot.setAttribute("name", "content");

        this.resizer = document.createElement("div");
        this.resizer.classList.add("resizer");

        this.wrapper.appendChild(this.contentSlot);
        this.wrapper.appendChild(this.resizer);

        this.resizer.addEventListener("mousedown", (e) => this.startResizing(e));

        this.minWidth = parseInt(this.getAttribute("min-width")) || 200;
        this.maxWidth = parseInt(this.getAttribute("max-width")) || 800;
        this.currentWidth = this.minWidth;

        const style = document.createElement("style");
        style.textContent = `
            .resizable-wrapper {
                display: flex;
                align-items: center;
                width: ${this.currentWidth}px;
                min-width: ${this.minWidth}px;
                max-width: ${this.maxWidth}px;
                border: 1px solid var(--input-border, #ccc);
                border-radius: var(--border-radius, 6px);
                position: relative;
                overflow: hidden;
                background: var(--card-bg, white);
            }
            .resizer {
                width: 10px;
                cursor: ew-resize;
                position: absolute;
                right: 0;
                top: 0;
                bottom: 0;
                background: var(--primary-color, #0073e6);
                opacity: 0.5;
            }
            .resizer:hover {
                opacity: 1;
            }
        `;

        this.shadowRoot.appendChild(style);
        this.shadowRoot.appendChild(this.wrapper);
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "min-width" || name === "max-width") {
            this.minWidth = parseInt(this.getAttribute("min-width")) || 200;
            this.maxWidth = parseInt(this.getAttribute("max-width")) || 800;
            this.wrapper.style.minWidth = `${this.minWidth}px`;
            this.wrapper.style.maxWidth = `${this.maxWidth}px`;
        }
    }

    startResizing(event) {
        event.preventDefault();
        document.addEventListener("mousemove", this.resize.bind(this));
        document.addEventListener("mouseup", this.stopResizing.bind(this));
    }

    resize(event) {
        const newWidth = event.clientX - this.wrapper.getBoundingClientRect().left;
        if (newWidth >= this.minWidth && newWidth <= this.maxWidth) {
            this.wrapper.style.width = `${newWidth}px`;
        }
    }

    stopResizing() {
        document.removeEventListener("mousemove", this.resize);
        document.removeEventListener("mouseup", this.stopResizing);
    }
}

customElements.define("custom-resizable", CustomResizable);
</script>