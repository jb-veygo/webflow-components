/**
 * Web Component: Custom Context Menu
 *
 * How to use in Webflow:
 * 1. Add an "Embed" element inside Webflow.
 * 2. Paste the following HTML:
 *      <custom-context-menu menu-items='[
 *          {"label": "Copy", "action": "copy"},
 *          {"label": "Paste", "action": "paste"},
 *          {"label": "Delete", "action": "delete"}
 *      ]'></custom-context-menu>
 * 3. Modify the "menu-items" attribute to define menu actions.
 * 4. Attach the context menu to any element using:
 *      document.querySelector('custom-context-menu').attachToElement(targetElement);
 * 5. Listen for menu actions using:
 *      document.querySelector('custom-context-menu').addEventListener('menu-item-selected', (e) => {
 *          console.log('Selected action:', e.detail.action);
 *      });
 */

<script>
class CustomContextMenu extends HTMLElement {
    static get observedAttributes() {
        return ["menu-items"];
    }

    constructor() {
        super();
        this.attachShadow({ mode: "open" });

        this.menu = document.createElement("div");
        this.menu.classList.add("context-menu");
        this.menu.style.display = "none";

        this.items = JSON.parse(this.getAttribute("menu-items") || "[]");
        this.renderMenu();

        document.addEventListener("click", () => this.closeMenu());
        document.addEventListener("contextmenu", (event) => this.handleContextMenu(event));

        const style = document.createElement("style");
        style.textContent = `
            .context-menu {
                position: absolute;
                background: white;
                border: 1px solid var(--input-border, #ccc);
                border-radius: var(--border-radius, 6px);
                box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
                padding: 5px;
                z-index: 1000;
                min-width: 150px;
            }
            .menu-item {
                padding: 8px 12px;
                cursor: pointer;
                font-size: var(--font-size, 14px);
                display: block;
                white-space: nowrap;
            }
            .menu-item:hover {
                background: var(--primary-hover, #e2e6ea);
            }
        `;

        this.shadowRoot.appendChild(style);
        this.shadowRoot.appendChild(this.menu);
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "menu-items") {
            this.items = JSON.parse(newValue || "[]");
            this.renderMenu();
        }
    }

    renderMenu() {
        this.menu.innerHTML = "";
        this.items.forEach(item => {
            const menuItem = document.createElement("div");
            menuItem.classList.add("menu-item");
            menuItem.textContent = item.label;
            menuItem.addEventListener("click", () => this.selectMenuItem(item));
            this.menu.appendChild(menuItem);
        });
    }

    attachToElement(targetElement) {
        targetElement.addEventListener("contextmenu", (event) => {
            event.preventDefault();
            this.openMenu(event.pageX, event.pageY);
        });
    }

    handleContextMenu(event) {
        event.preventDefault();
        this.openMenu(event.pageX, event.pageY);
    }

    openMenu(x, y) {
        this.menu.style.display = "block";
        this.menu.style.left = `${x}px`;
        this.menu.style.top = `${y}px`;
    }

    closeMenu() {
        this.menu.style.display = "none";
    }

    selectMenuItem(item) {
        this.dispatchEvent(new CustomEvent("menu-item-selected", {
            detail: { action: item.action },
            bubbles: true
        }));
        this.closeMenu();
    }
}

customElements.define("custom-context-menu", CustomContextMenu);
</script>