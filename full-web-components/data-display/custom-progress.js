/**
 * Web Component: Custom Progress Bar
 *
 * How to use in Webflow:
 * 1. Add an "Embed" element inside Webflow.
 * 2. Paste the following HTML:
 *      <custom-progress value="50" max="100"></custom-progress>
 * 3. Modify the "value" attribute to change the progress percentage.
 * 4. Modify the "max" attribute to set the maximum value.
 * 5. Update progress dynamically using:
 *      document.querySelector('custom-progress').setProgress(75);
 */

<script>
class CustomProgress extends HTMLElement {
    static get observedAttributes() {
        return ["value", "max"];
    }

    constructor() {
        super();
        this.attachShadow({ mode: "open" });

        this.wrapper = document.createElement("div");
        this.wrapper.classList.add("progress-wrapper");

        this.progressBar = document.createElement("div");
        this.progressBar.classList.add("progress-bar");

        this.wrapper.appendChild(this.progressBar);

        this.updateProgress();

        const style = document.createElement("style");
        style.textContent = `
            .progress-wrapper {
                width: 100%;
                height: 10px;
                background: var(--progress-bg, #e0e0e0);
                border-radius: var(--border-radius, 5px);
                overflow: hidden;
            }
            .progress-bar {
                height: 100%;
                width: 0%;
                background: var(--primary-color, #0073e6);
                transition: width 0.3s ease-in-out;
            }
        `;

        this.shadowRoot.appendChild(style);
        this.shadowRoot.appendChild(this.wrapper);
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "value" || name === "max") {
            this.updateProgress();
        }
    }

    updateProgress() {
        const value = parseInt(this.getAttribute("value")) || 0;
        const max = parseInt(this.getAttribute("max")) || 100;
        const percentage = Math.min(100, (value / max) * 100);
        this.progressBar.style.width = `${percentage}%`;
    }

    setProgress(value) {
        this.setAttribute("value", value);
    }
}

customElements.define("custom-progress", CustomProgress);
</script>