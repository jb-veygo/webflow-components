/**
 * Web Component: Custom Accordion
 *
 * How to use in Webflow:
 * 1. Add an "Embed" element inside Webflow.
 * 2. Paste the following HTML:
 *      <custom-accordion>
 *          <div slot="accordion-item" data-title="Section 1">Content for section 1</div>
 *          <div slot="accordion-item" data-title="Section 2">Content for section 2</div>
 *          <div slot="accordion-item" data-title="Section 3">Content for section 3</div>
 *      </custom-accordion>
 * 3. Each `<div slot="accordion-item">` represents a collapsible section.
 * 4. Listen for section toggle events using:
 *      document.querySelector('custom-accordion').addEventListener('accordion-toggled', (e) => {
 *          console.log('Toggled section:', e.detail.title);
 *      });
 */

<script>
class CustomAccordion extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });

        this.wrapper = document.createElement("div");
        this.wrapper.classList.add("accordion-wrapper");

        this.renderAccordion();

        const style = document.createElement("style");
        style.textContent = `
            .accordion-wrapper {
                display: flex;
                flex-direction: column;
                width: 100%;
            }
            .accordion-item {
                border-bottom: 1px solid var(--input-border, #ccc);
            }
            .accordion-header {
                background: var(--accordion-header-bg, #f8f9fa);
                padding: 12px;
                font-size: var(--font-size, 16px);
                font-weight: bold;
                cursor: pointer;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .accordion-content {
                display: none;
                padding: 12px;
                background: var(--accordion-content-bg, white);
                overflow: hidden;
            }
            .accordion-content.open {
                display: block;
            }
        `;

        this.shadowRoot.appendChild(style);
        this.shadowRoot.appendChild(this.wrapper);
    }

    connectedCallback() {
        this.renderAccordion();
    }

    renderAccordion() {
        this.wrapper.innerHTML = "";

        const slotItems = Array.from(this.children);
        slotItems.forEach((item, index) => {
            const title = item.getAttribute("data-title") || `Section ${index + 1}`;
            const itemWrapper = document.createElement("div");
            itemWrapper.classList.add("accordion-item");

            const header = document.createElement("div");
            header.classList.add("accordion-header");
            header.textContent = title;
            header.addEventListener("click", () => this.toggleSection(content, title));

            const content = document.createElement("div");
            content.classList.add("accordion-content");
            content.appendChild(item.cloneNode(true));

            itemWrapper.appendChild(header);
            itemWrapper.appendChild(content);
            this.wrapper.appendChild(itemWrapper);
        });
    }

    toggleSection(content, title) {
        const isOpen = content.classList.toggle("open");
        this.dispatchEvent(new CustomEvent("accordion-toggled", {
            detail: { title, open: isOpen },
            bubbles: true
        }));
    }
}

customElements.define("custom-accordion", CustomAccordion);
</script>