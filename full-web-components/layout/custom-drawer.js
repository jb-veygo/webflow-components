/**
 * Web Component: Custom Drawer
 *
 * How to use in Webflow:
 * 1. Add an "Embed" element inside Webflow.
 * 2. Paste the following HTML:
 *      <custom-drawer position="left">
 *          <div slot="content">
 *              <h3>Drawer Title</h3>
 *              <p>This is the drawer content.</p>
 *              <button onclick="document.querySelector('custom-drawer').closeDrawer()">Close</button>
 *          </div>
 *      </custom-drawer>
 * 3. Modify the "position" attribute (options: left, right) to change the drawer placement.
 * 4. Open and close the drawer using:
 *      document.querySelector('custom-drawer').openDrawer();
 *      document.querySelector('custom-drawer').closeDrawer();
 * 5. Listen for open/close events using:
 *      document.querySelector('custom-drawer').addEventListener('drawer-toggle', (e) => {
 *          console.log('Drawer open:', e.detail.open);
 *      });
 */

<script>
class CustomDrawer extends HTMLElement {
    static get observedAttributes() {
        return ["position"];
    }

    constructor() {
        super();
        this.attachShadow({ mode: "open" });

        this.wrapper = document.createElement("div");
        this.wrapper.classList.add("drawer-wrapper");

        this.overlay = document.createElement("div");
        this.overlay.classList.add("overlay");
        this.overlay.addEventListener("click", () => this.closeDrawer());

        this.drawer = document.createElement("div");
        this.drawer.classList.add("drawer");

        this.contentSlot = document.createElement("slot");
        this.contentSlot.setAttribute("name", "content");

        this.drawer.appendChild(this.contentSlot);
        this.wrapper.appendChild(this.overlay);
        this.wrapper.appendChild(this.drawer);

        this.updatePosition();

        const style = document.createElement("style");
        style.textContent = `
            .drawer-wrapper {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
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
            .drawer {
                position: absolute;
                top: 0;
                width: 300px;
                height: 100%;
                background: white;
                padding: 16px;
                box-shadow: 2px 0 10px rgba(0, 0, 0, 0.2);
                transition: transform 0.3s ease-in-out;
            }
            .drawer.left {
                left: 0;
                transform: translateX(-100%);
            }
            .drawer.right {
                right: 0;
                transform: translateX(100%);
            }
            .drawer.open {
                transform: translateX(0);
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
        this.drawer.classList.remove("left", "right");
        this.drawer.classList.add(position);
    }

    openDrawer() {
        this.wrapper.style.display = "block";
        setTimeout(() => this.drawer.classList.add("open"), 10);
        this.dispatchEvent(new CustomEvent("drawer-toggle", {
            detail: { open: true },
            bubbles: true
        }));
    }

    closeDrawer() {
        this.drawer.classList.remove("open");
        setTimeout(() => {
            this.wrapper.style.display = "none";
            this.dispatchEvent(new CustomEvent("drawer-toggle", {
                detail: { open: false },
                bubbles: true
            }));
        }, 300);
    }
}

customElements.define("custom-drawer", CustomDrawer);
</script>