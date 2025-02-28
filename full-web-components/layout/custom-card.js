/**
 * Web Component: Custom Card
 *
 * How to use in Webflow:
 * 1. Add an "Embed" element inside Webflow.
 * 2. Paste the following HTML:
 *      <custom-card title="Card Title" image="https://via.placeholder.com/300">
 *          <p slot="content">This is the card content.</p>
 *          <button slot="actions">Learn More</button>
 *      </custom-card>
 * 3. Modify the "title" attribute to change the card title.
 * 4. Modify the "image" attribute to set the card's image.
 * 5. Add content inside the `<p slot="content">` slot.
 * 6. Add buttons or links inside the `<button slot="actions">` slot.
 */

<script>
class CustomCard extends HTMLElement {
    static get observedAttributes() {
        return ["title", "image"];
    }

    constructor() {
        super();
        this.attachShadow({ mode: "open" });

        this.wrapper = document.createElement("div");
        this.wrapper.classList.add("card");

        this.image = document.createElement("img");
        this.image.classList.add("card-image");
        this.image.src = this.getAttribute("image") || "https://via.placeholder.com/300";
        this.image.alt = "Card Image";

        this.titleElement = document.createElement("h3");
        this.titleElement.classList.add("card-title");
        this.titleElement.textContent = this.getAttribute("title") || "Card Title";

        this.contentSlot = document.createElement("slot");
        this.contentSlot.setAttribute("name", "content");

        this.actionsSlot = document.createElement("slot");
        this.actionsSlot.setAttribute("name", "actions");

        this.body = document.createElement("div");
        this.body.classList.add("card-body");
        this.body.appendChild(this.contentSlot);

        this.footer = document.createElement("div");
        this.footer.classList.add("card-footer");
        this.footer.appendChild(this.actionsSlot);

        this.wrapper.appendChild(this.image);
        this.wrapper.appendChild(this.titleElement);
        this.wrapper.appendChild(this.body);
        this.wrapper.appendChild(this.footer);

        const style = document.createElement("style");
        style.textContent = `
            .card {
                background: var(--card-bg, white);
                border-radius: var(--border-radius, 10px);
                box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
                padding: 16px;
                text-align: center;
                max-width: 300px;
            }
            .card-image {
                width: 100%;
                border-radius: var(--border-radius, 10px);
            }
            .card-title {
                font-size: var(--font-size, 18px);
                margin-top: 10px;
            }
            .card-body {
                margin-top: 10px;
            }
            .card-footer {
                margin-top: 15px;
            }
        `;

        this.shadowRoot.appendChild(style);
        this.shadowRoot.appendChild(this.wrapper);
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "title") {
            this.titleElement.textContent = newValue;
        } else if (name === "image") {
            this.image.src = newValue;
        }
    }
}

customElements.define("custom-card", CustomCard);
</script>