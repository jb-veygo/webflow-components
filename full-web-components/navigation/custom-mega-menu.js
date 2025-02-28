/**
 * Web Component: Custom Mega Menu
 *
 * How to use in Webflow:
 * 1. Add an "Embed" element inside Webflow.
 * 2. Paste the following HTML:
 *      <custom-mega-menu label="Menu">
 *          <div slot="menu-item" title="Category 1">
 *              <a href="#">Item 1</a>
 *              <a href="#">Item 2</a>
 *          </div>
 *          <div slot="menu-item" title="Category 2">
 *              <a href="#">Item 3</a>
 *              <a href="#">Item 4</a>
 *          </div>
 *      </custom-mega-menu>
 * 3. Modify the "label" attribute to change the menu button text.
 * 4. Add menu categories inside the component with `slot="menu-item"` and `title="Category Name"`.
 * 5. Listen for selection changes using:
 *      document.querySelector('custom-mega-menu').addEventListener('item-selected', (e) => {
 *          console.log('Selected item:', e.detail.item);
 *      });
 */
<script>
class CustomMegaMenu extends HTMLElement {
    static get observedAttributes() {
        return ["label"];
    }

    constructor() {
        super();
        this.attachShadow({ mode: "open" });

        this.wrapper = document.createElement("div");
        this.wrapper.classList.add("mega-menu");

        this.button = document.createElement("button");
        this.button.textContent = this.getAttribute("label") || "Menu";
        this.button.classList.add("mega-menu-btn");
        this.button.addEventListener("click", () => this.toggleMenu());

        this.menuContainer = document.createElement("div");
        this.menuContainer.classList.add("mega-menu-content");

        const slot = document.createElement("slot");
        slot.setAttribute("name", "menu-item");
        slot.addEventListener("slotchange", () => this.setupMenuItems());

        this.menuContainer.appendChild(slot);
        this.wrapper.appendChild(this.button);
        this.wrapper.appendChild(this.menuContainer);

        const style = document.createElement("style");
        style.textContent = `
            .mega-menu {
                position: relative;
                display: inline-block;
            }
            .mega-menu-btn {
                background: var(--primary-color, #0073e6);
                color: white;
                padding: 10px 16px;
                border: none;
                border-radius: var(--border-radius, 6px);
                cursor: pointer;
            }
            .mega-menu-content {
                display: none;
                position: absolute;
                width: 250px;
                background: white;
                border: 1px solid var(--input-border, #ccc);
                border-radius: var(--border-radius, 6px);
                box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
                z-index: 10;
                padding: 12px;
            }
            .mega-menu-content.visible {
                display: block;
            }
            ::slotted([slot="menu-item"]) {
                font-weight: bold;
                margin-bottom: 6px;
                display: block;
            }
            ::slotted([slot="menu-item"] a) {
                display: block;
                padding: 6px;
                text-decoration: none;
                color: black;
                font-weight: normal;
            }
            ::slotted([slot="menu-item"] a:hover) {
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

    toggleMenu() {
        this.menuContainer.classList.toggle("visible");
    }

    setupMenuItems() {
        const items = this.shadowRoot.querySelector("slot").assignedElements();
        items.forEach(category => {
            const title = document.createElement("div");
            title.textContent = category.getAttribute("title") || "Category";
            title.style.fontWeight = "bold";
            title.style.marginBottom = "6px";
            category.prepend(title);

            category.querySelectorAll("a").forEach(link => {
                link.addEventListener("click", () => this.selectItem(link.textContent));
            });
        });
    }

    selectItem(value) {
        this.menuContainer.classList.remove("visible");
        this.dispatchEvent(new CustomEvent("item-selected", {
            detail: { item: value },
            bubbles: true
        }));
    }
}

customElements.define("custom-mega-menu", CustomMegaMenu);
</script>