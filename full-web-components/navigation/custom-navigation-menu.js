/**
 * Web Component: Custom Navigation Menu
 *
 * How to use in Webflow:
 * 1. Add an "Embed" element inside Webflow.
 * 2. Paste the following HTML:
 *      <custom-navigation-menu>
 *          <a slot="nav-item" href="#">Home</a>
 *          <a slot="nav-item" href="#">About</a>
 *          <a slot="nav-item" href="#">Services</a>
 *          <a slot="nav-item" href="#">Contact</a>
 *      </custom-navigation-menu>
 * 3. Add navigation items inside the component using `<a slot="nav-item">`.
 * 4. Use CSS in Webflow to style the links as needed.
 */

<script>
class CustomNavigationMenu extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });

        this.navWrapper = document.createElement("nav");
        this.navWrapper.classList.add("nav-menu");

        const slot = document.createElement("slot");
        slot.setAttribute("name", "nav-item");

        this.navWrapper.appendChild(slot);

        const style = document.createElement("style");
        style.textContent = `
            .nav-menu {
                display: flex;
                gap: 16px;
                background: var(--nav-background, #f8f9fa);
                padding: 10px 16px;
                border-radius: var(--border-radius, 6px);
            }
            ::slotted([slot="nav-item"]) {
                text-decoration: none;
                color: var(--nav-text-color, #000);
                font-size: var(--font-size, 16px);
                padding: 8px 12px;
                border-radius: var(--border-radius, 4px);
                transition: background 0.3s ease;
            }
            ::slotted([slot="nav-item"]:hover) {
                background: var(--nav-hover-background, #e2e6ea);
            }
        `;

        this.shadowRoot.appendChild(style);
        this.shadowRoot.appendChild(this.navWrapper);
    }
}

customElements.define("custom-navigation-menu", CustomNavigationMenu);
</script>