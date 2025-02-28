<script>
class CustomSheet extends HTMLElement {
    static get observedAttributes() {
        return ["position", "width"];
    }

    constructor() {
        super();
        this.attachShadow({ mode: "open" });

        this.wrapper = document.createElement("div");
        this.wrapper.classList.add("sheet-wrapper");

        this.overlay = document.createElement("div");
        this.overlay.classList.add("overlay");
        this.overlay.addEventListener("click", () => this.closeSheet());

        this.sheet = document.createElement("div");
        this.sheet.classList.add("sheet");

        this.contentSlot = document.createElement("slot");
        this.contentSlot.setAttribute("name", "content");

        this.sheet.appendChild(this.contentSlot);
        this.wrapper.appendChild(this.overlay);
        this.wrapper.appendChild(this.sheet);

        this.updatePosition();
        this.updateWidth();

        const style = document.createElement("style");
        style.textContent = `
            .sheet-wrapper {
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
            .sheet {
                position: absolute;
                background: white;
                padding: 16px;
                box-shadow: 2px 0 10px rgba(0, 0, 0, 0.2);
                transition: transform 0.3s ease-in-out;
                height: 100%;
                width: var(--sheet-width, 300px);
            }
            .sheet.left {
                left: 0;
                transform: translateX(-100%);
            }
            .sheet.right {
                right: 0;
                transform: translateX(100%);
            }
            .sheet.bottom {
                bottom: 0;
                width: 100%;
                height: var(--sheet-width, 300px);
                transform: translateY(100%);
            }
            .sheet.open {
                transform: translateX(0);
            }
            .sheet.open.bottom {
                transform: translateY(0);
            }
        `;

        this.shadowRoot.appendChild(style);
        this.shadowRoot.appendChild(this.wrapper);
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "position") {
            this.updatePosition();
        } else if (name === "width") {
            this.updateWidth();
        }
    }

    updatePosition() {
        const position = this.getAttribute("position") || "right";
        this.sheet.classList.remove("left", "right", "bottom");
        this.sheet.classList.add(position);
    }

    updateWidth() {
        this.sheet.style.setProperty("--sheet-width", this.getAttribute("width") || "300px");
    }

    openSheet() {
        this.wrapper.style.display = "block";
        setTimeout(() => this.sheet.classList.add("open"), 10);
        this.dispatchEvent(new CustomEvent("sheet-toggle", {
            detail: { open: true },
            bubbles: true
        }));
    }

    closeSheet() {
        this.sheet.classList.remove("open");
        setTimeout(() => {
            this.wrapper.style.display = "none";
            this.dispatchEvent(new CustomEvent("sheet-toggle", {
                detail: { open: false },
                bubbles: true
            }));
        }, 300);
    }
}

customElements.define("custom-sheet", CustomSheet);
</script>