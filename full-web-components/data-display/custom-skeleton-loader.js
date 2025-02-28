// Placeholder for custom-skeleton-loader.js
/**
 * Web Component: Custom Skeleton Loader
 *
 * How to use in Webflow:
 * 1. Add an "Embed" element inside Webflow.
 * 2. Paste the following HTML:
 *      <custom-skeleton-loader width="100%" height="20px"></custom-skeleton-loader>
 * 3. Modify the "width" and "height" attributes to set the skeleton dimensions.
 * 4. Add multiple loaders to simulate different UI elements.
 * 5. Remove the loader when content is ready.
 */

<script>
class CustomSkeletonLoader extends HTMLElement {
    static get observedAttributes() {
        return ["width", "height"];
    }

    constructor() {
        super();
        this.attachShadow({ mode: "open" });

        this.wrapper = document.createElement("div");
        this.wrapper.classList.add("skeleton");

        this.updateStyle();

        const style = document.createElement("style");
        style.textContent = `
            .skeleton {
                background: linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%);
                background-size: 200% 100%;
                animation: shimmer 1.5s infinite;
                border-radius: var(--border-radius, 4px);
            }
            @keyframes shimmer {
                0% { background-position: 100% 0; }
                100% { background-position: -100% 0; }
            }
        `;

        this.shadowRoot.appendChild(style);
        this.shadowRoot.appendChild(this.wrapper);
    }

    attributeChangedCallback(name, oldValue, newValue) {
        this.updateStyle();
    }

    updateStyle() {
        this.wrapper.style.width = this.getAttribute("width") || "100%";
        this.wrapper.style.height = this.getAttribute("height") || "20px";
    }
}

customElements.define("custom-skeleton-loader", CustomSkeletonLoader);
</script>