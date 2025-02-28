/**
 * Web Component: Custom Sidebar
 *
 * How to use in Webflow:
 * 1. Add an "Embed" element inside Webflow.
 * 2. Paste the following HTML:
 *      <custom-sidebar position="left">
 *          <div slot="header">Sidebar Title</div>
 *          <a slot="item" href="#">Home</a>
 *          <a slot="item" href="#">About</a>
 *          <a slot="item" href="#">Services</a>
 *          <a slot="item" href="#">Contact</a>
 *      </custom-sidebar>
 * 3. Modify the "position" attribute to "left" or "right" for sidebar placement.
 * 4. Add navigation items inside the component using `<a slot="item">`.
 * 5. Listen for open/close events using:
 *      document.querySelector('custom-sidebar').addEventListener('sidebar-toggle', (e) => {
 *          console.log('Sidebar open:', e.detail.open);
 *      });
 */

<script>
class CustomSidebar extends HTMLElement {
    static get observedAttributes() {
        return ["position"];
    }

    constructor() {
        super();
        this.attachShadow({ mode: "open" });

        this.wrapper = document.createElement("div");
        this.wrapper.classList.add("sidebar-wrapper");

        this.sidebar = document.createElement("div");
        this.sidebar.classList.add("sidebar");

        this.overlay = document.createElement("div");
        this.overlay.classList.add("overlay");
        this.overlay.addEventListener("click", () => this.closeSidebar());

        this.closeButton = document.createElement("button");
        this.closeButton.classList.add("close-button");
        this.closeButton.textContent = "×";
        this.closeButton.addEventListener("click", () => this.closeSidebar());

        const headerSlot = document.createElement("slot");
        headerSlot.setAttribute("name", "header");

        const itemsSlot = document.createElement("slot");
        itemsSlot.setAttribute("name", "item");

        this.sidebar.appendChild(this.closeButton);
        this.sidebar.appendChild(headerSlot);
        this.sidebar.appendChild(itemsSlot);
        this.wrapper.appendChild(this.overlay);
        this.wrapper.appendChild(this.sidebar);

        this.updatePosition();

        const style = document.createElement("style");
        style.textContent = `
            .sidebar-wrapper {
                position: fixed;
                top: 0;
                height: 100%;
                width: 100%;
                display: none;
                z-index: 1000;
            }
            .overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
            }
            .sidebar {
                position: absolute;
                top: 0;
                width: 250px;
                height: 100%;
                background: white;
                padding: 16px;
                box-shadow: 2px 0 10px rgba(0, 0, 0, 0.2);
                display: flex;
                flex-direction: column;
                transition: transform 0.3s ease-in-out;
            }
            .sidebar.left {
                left: 0;
                transform: translateX(-100%);
            }
            .sidebar.right {
                right: 0;
                transform: translateX(100%);
            }
            .sidebar.open {
                transform: translateX(0);
            }
            .close-button {
                background: none;
                border: none;
                font-size: 24px;
                cursor: pointer;
                align-self: flex-end;
            }
            ::slotted([slot="item"]) {
                text-decoration: none;
                color: black;
                padding: 10px;
                display: block;
                border-radius: var(--border-radius, 6px);
            }
            ::slotted([slot="item"]:hover) {
                background: var(--primary-hover, #e2e6ea);
            }
        `;

        this.shadowRoot.appendChild(style);
        this.shadowRoot.appendChild(this.wrapper);
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "position") {
            this.updatePosition();
        }
    }

    updatePosition() {
        const position = this.getAttribute("position") || "left";
        this.sidebar.classList.remove("left", "right");
        this.sidebar.classList.add(position);
    }

    openSidebar() {
        this.wrapper.style.display = "block";
        setTimeout(() => this.sidebar.classList.add("open"), 10);
        this.dispatchEvent(new CustomEvent("sidebar-toggle", {
            detail: { open: true },
            bubbles: true
        }));
    }

    closeSidebar() {
        this.sidebar.classList.remove("open");
        setTimeout(() => {
            this.wrapper.style.display = "none";
            this.dispatchEvent(new CustomEvent("sidebar-toggle", {
                detail: { open: false },
                bubbles: true
            }));
        }, 300);
    }
}

customElements.define("custom-sidebar", CustomSidebar);
</script>