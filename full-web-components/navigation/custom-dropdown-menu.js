/**
 * Web Component: Custom Dropdown Menu
 *
 * How to use in Webflow:
 * 1. Add an "Embed" element inside Webflow.
 * 2. Paste the following HTML:
 *      <custom-dropdown-menu label="Menu">
 *          <div slot="item">Item 1</div>
 *          <div slot="item">Item 2</div>
 *          <div slot="item">Item 3</div>
 *      </custom-dropdown-menu>
 * 3. Modify the "label" attribute to change the menu button text.
 * 4. Add dropdown items inside the component with `slot="item"`.
 * 5. Listen for selection changes using:
 *      document.querySelector('custom-dropdown-menu').addEventListener('item-selected', (e) => {
 *          console.log('Selected item:', e.detail.item);
 *      });
 */

<script>
class CustomDropdownMenu extends HTMLElement {
    static get observedAttributes() {
        return ["label"];
    }

    constructor() {
        super();
        this.attachShadow({ mode: "open" });

        this.wrapper = document.createElement("div");
        this.wrapper.classList.add("dropdown-menu");

        this.button = document.createElement("button");
        this.button.textContent = this.getAttribute("label") || "Menu";
        this.button.classList.add("dropdown-btn");
        this.button.addEventListener("click", () => this.toggleDropdown());

        this.menu = document.createElement("div");
        this.menu.classList.add("dropdown-content");

        const slot = document.createElement("slot");
        slot.setAttribute("name", "item");
        slot.addEventListener("slotchange", () => this.addEventListenersToItems());

        this.menu.appendChild(slot);
        this.wrapper.appendChild(this.button);
        this.wrapper.appendChild(this.menu);

        const style = document.createElement("style");
        style.textContent = `
            .dropdown-menu {
                position: relative;
                display: inline-block;
            }
            .dropdown-btn {
                background: var(--primary-color, #0073e6);
                color: white;
                padding: 8px 16px;
                border: none;
                border-radius: var(--border-radius, 6px);
                cursor: pointer;
            }
            .dropdown-content {
                display: none;
                position: absolute;
                width: 100%;
                background: white;
                border: 1px solid var(--input-border, #ccc);
                border-radius: var(--border-radius, 6px);
                box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
                z-index: 10;
            }
            .dropdown-content.visible {
                display: block;
            }
            ::slotted([slot="item"]) {
                padding: 8px 12px;
                cursor: pointer;
                display: block;
            }
            ::slotted([slot="item"]:hover) {
                background: var(--primary-hover, #e2e6ea);
            }
        `;

        this.shadowRoot.appendChild(style);
        this.shadowRoot.appendChild(this.wrapper);
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "label") {
            this.button.textContent = newValue;
        }
    }

    toggleDropdown() {
        this.menu.classList.toggle("visible");
    }

    addEventListenersToItems() {
        const items = this.shadowRoot.querySelector("slot").assignedElements();
        items.forEach(item => {
            item.addEventListener("click", () => this.selectItem(item.textContent));
        });
    }

    selectItem(value) {
        this.menu.classList.remove("visible");
        this.dispatchEvent(new CustomEvent("item-selected", {
            detail: { item: value },
            bubbles: true
        }));
    }
}

customElements.define("custom-dropdown-menu", CustomDropdownMenu);
</script>