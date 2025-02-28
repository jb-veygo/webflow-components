/**
 * Web Component: Custom Sticky Header
 *
 * How to use in Webflow:
 * 1. Add an "Embed" element inside Webflow.
 * 2. Paste the following HTML:
 *      <custom-sticky-header>
 *          <div slot="content">Your Sticky Header Content</div>
 *      </custom-sticky-header>
 * 3. Add any header content inside the component using `<div slot="content">`.
 * 4. The header will automatically stick to the top when scrolling.
 */

<script>
class CustomStickyHeader extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });

        this.header = document.createElement("header");
        this.header.classList.add("sticky-header");

        const slot = document.createElement("slot");
        slot.setAttribute("name", "content");

        this.header.appendChild(slot);

        const style = document.createElement("style");
        style.textContent = `
            .sticky-header {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                background: var(--header-background, #fff);
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                padding: 10px 16px;
                z-index: 1000;
                transition: transform 0.3s ease-in-out;
            }
            .sticky-header.hidden {
                transform: translateY(-100%);
            }
        `;

        this.shadowRoot.appendChild(style);
        this.shadowRoot.appendChild(this.header);

        this.lastScrollY = window.scrollY;
        this.handleScroll = this.handleScroll.bind(this);
    }

    connectedCallback() {
        window.addEventListener("scroll", this.handleScroll);
    }

    disconnectedCallback() {
        window.removeEventListener("scroll", this.handleScroll);
    }

    handleScroll() {
        if (window.scrollY > this.lastScrollY) {
            this.header.classList.add("hidden");
        } else {
            this.header.classList.remove("hidden");
        }
        this.lastScrollY = window.scrollY;
    }
}

customElements.define("custom-sticky-header", CustomStickyHeader);
</script>