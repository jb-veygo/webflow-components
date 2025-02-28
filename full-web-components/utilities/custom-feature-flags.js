/**
 * Web Component: Custom Feature Flags
 *
 * How to use in Webflow:
 * 1. Add an "Embed" element inside Webflow.
 * 2. Paste the following HTML:
 *      <custom-feature-flags flags='{"betaFeature": true, "darkMode": false}'>
 *          <div flag="betaFeature">This is a Beta Feature</div>
 *          <div flag="darkMode">This is only visible in Dark Mode</div>
 *      </custom-feature-flags>
 * 3. Modify the "flags" attribute with a JSON object of feature flags.
 * 4. Wrap content inside `<div flag="featureName">` to conditionally display it.
 * 5. Toggle feature flags dynamically using:
 *      document.querySelector('custom-feature-flags').setFlags({ betaFeature: false });
 */

<script>
class CustomFeatureFlags extends HTMLElement {
    static get observedAttributes() {
        return ["flags"];
    }

    constructor() {
        super();
        this.attachShadow({ mode: "open" });

        this.wrapper = document.createElement("div");
        this.wrapper.classList.add("feature-flags");

        this.flags = JSON.parse(this.getAttribute("flags") || "{}");

        this.updateVisibility();

        const style = document.createElement("style");
        style.textContent = `
            .hidden { display: none; }
        `;

        this.shadowRoot.appendChild(style);
        this.shadowRoot.appendChild(this.wrapper);
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "flags") {
            this.flags = JSON.parse(newValue || "{}");
            this.updateVisibility();
        }
    }

    setFlags(newFlags) {
        this.flags = { ...this.flags, ...newFlags };
        this.updateVisibility();
        this.setAttribute("flags", JSON.stringify(this.flags));
    }

    updateVisibility() {
        const slots = this.querySelectorAll("[flag]");
        slots.forEach(slot => {
            const flagName = slot.getAttribute("flag");
            if (this.flags[flagName]) {
                slot.classList.remove("hidden");
            } else {
                slot.classList.add("hidden");
            }
        });
    }
}

customElements.define("custom-feature-flags", CustomFeatureFlags);
</script>