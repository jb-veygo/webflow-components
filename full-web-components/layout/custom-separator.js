<script>
class CustomSeparator extends HTMLElement {
    static get observedAttributes() {
        return ["type", "thickness", "color"];

    }

    constructor() {
        super();
        this.attachShadow({ mode: "open" });

        this.separator = document.createElement("div");
        this.separator.classList.add("separator");

        this.updateSeparator();

        const style = document.createElement("style");
        style.textContent = `
            .separator {
                width: 100%;
                height: var(--separator-thickness, 1px);
                background: var(--separator-color, #ccc);
                margin: 10px 0;
            }
            .separator.dashed {
                border-top: var(--separator-thickness, 1px) dashed var(--separator-color, #ccc);
                background: none;
            }
            .separator.dotted {
                border-top: var(--separator-thickness, 1px) dotted var(--separator-color, #ccc);
                background: none;
            }
        `;

        this.shadowRoot.appendChild(style);
        this.shadowRoot.appendChild(this.separator);
    }

    attributeChangedCallback(name, oldValue, newValue) {
        this.updateSeparator();
    }

    updateSeparator() {
        const type = this.getAttribute("type") || "solid";
        const thickness = this.getAttribute("thickness") || "1px";
        const color = this.getAttribute("color") || "#ccc";

        this.separator.classList.remove("solid", "dashed", "dotted");
        this.separator.classList.add(type);

        this.separator.style.setProperty("--separator-thickness", thickness);
        this.separator.style.setProperty("--separator-color", color);
    }
}

customElements.define("custom-separator", CustomSeparator);
</script>