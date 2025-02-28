/**
 * Web Component: Custom Hover Card
 *
 * How to use in Webflow:
 * 1. Add an "Embed" element inside Webflow.
 * 2. Paste the following HTML:
 *      <custom-hover-card text="Hover over me!">
 *          <div slot="content">This is additional info on hover.</div>
 *      </custom-hover-card>
 * 3. Modify the "text" attribute to change the hoverable element.
 * 4. Add content inside the component using `<div slot="content">`.
 */

<script> 
class CustomHoverCard extends HTMLElement {
    static get observedAttributes() {
        return ["text"];
    }

    constructor() {
        super();
        this.attachShadow({ mode: "open" });

        this.wrapper = document.createElement("div");
        this.wrapper.classList.add("hover-wrapper");

        this.trigger = document.createElement("span");
        this.trigger.classList.add("hover-trigger");
        this.trigger.textContent = this.getAttribute("text") || "Hover over me!";

        this.card = document.createElement("div");
        this.card.classList.add("hover-card");
        this.card.style.display = "none";

        this.contentSlot = document.createElement("slot");
        this.contentSlot.setAttribute("name", "content");

        this.card.appendChild(this.contentSlot);
        this.wrapper.appendChild(this.trigger);
        this.wrapper.appendChild(this.card);

        this.trigger.addEventListener("mouseenter", () => this.showCard());
        this.trigger.addEventListener("mouseleave", () => this.hideCard());

        const style = document.createElement("style");
        style.textContent = `
            .hover-wrapper {
                display: inline-block;
                position: relative;
            }
            .hover-trigger {
                cursor: pointer;
                text-decoration: underline;
                color: var(--primary-color, #0073e6);
            }
            .hover-card {
                position: absolute;
                top: 100%;
                left: 50%;
                transform: translateX(-50%);
                background: var(--card-bg, white);
                border: 1px solid var(--input-border, #ccc);
                border-radius: var(--border-radius, 6px);
                box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
                padding: 10px;
                min-width: 200px;
                white-space: nowrap;
                z-index: 10;
            }
        `;

        this.shadowRoot.appendChild(style);
        this.shadowRoot.appendChild(this.wrapper);
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "text") {
            this.trigger.textContent = newValue;
        }
    }

    showCard() {
        this.card.style.display = "block";
    }

    hideCard() {
        this.card.style.display = "none";
    }
}

customElements.define("custom-hover-card", CustomHoverCard);
</script>