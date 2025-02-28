/**
 * Web Component: Custom Floating Action Button (FAB)
 *
 * How to use in Webflow:
 * 1. Add an "Embed" element inside Webflow.
 * 2. Paste the following HTML:
 *      <custom-fab icon="+" position="bottom-right"></custom-fab>
 * 3. Modify the "icon" attribute to change the FAB content (e.g., "+", "⚡").
 * 4. Modify the "position" attribute to set the FAB location (options: "bottom-right", "bottom-left").
 * 5. Listen for click events using:
 *      document.querySelector('custom-fab').addEventListener('fab-click', () => {
 *          console.log('FAB clicked!');
 *      });
 */

<script>
class CustomFab extends HTMLElement {
    static get observedAttributes() {
        return ["icon", "position"];
    }

    constructor() {
        super();
        this.attachShadow({ mode: "open" });

        this.fab = document.createElement("button");
        this.fab.classList.add("fab");
        this.fab.textContent = this.getAttribute("icon") || "+";

        this.fab.addEventListener("click", () => {
            this.dispatchEvent(new Event("fab-click", { bubbles: true }));
        });

        this.updatePosition();

        const style = document.createElement("style");
        style.textContent = `
            .fab {
                position: fixed;
                width: 56px;
                height: 56px;
                background: var(--primary-color, #0073e6);
                color: white;
                border: none;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 24px;
                cursor: pointer;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                transition: transform 0.2s ease-in-out;
            }
            .fab:hover {
                transform: scale(1.1);
            }
            .bottom-right {
                bottom: 20px;
                right: 20px;
            }
            .bottom-left {
                bottom: 20px;
                left: 20px;
            }
        `;

        this.shadowRoot.appendChild(style);
        this.shadowRoot.appendChild(this.fab);
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "icon") {
            this.fab.textContent = newValue;
        } else if (name === "position") {
            this.updatePosition();
        }
    }

    updatePosition() {
        const position = this.getAttribute("position") || "bottom-right";
        this.fab.classList.remove("bottom-left", "bottom-right");
        this.fab.classList.add(position);
    }
}

customElements.define("custom-fab", CustomFab);
</script>