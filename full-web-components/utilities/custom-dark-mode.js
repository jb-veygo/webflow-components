/**
 * Web Component: Custom Dark Mode Toggle
 *
 * How to use in Webflow:
 * 1. Add an "Embed" element inside Webflow.
 * 2. Paste the following HTML:
 *      <custom-dark-mode></custom-dark-mode>
 * 3. The toggle will switch between dark and light mode.
 * 4. The dark mode preference is saved in `localStorage`.
 */

<script>
class CustomDarkMode extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });

        this.button = document.createElement("button");
        this.button.classList.add("dark-mode-toggle");
        this.button.textContent = "Toggle Dark Mode";

        this.button.addEventListener("click", () => this.toggleDarkMode());

        const style = document.createElement("style");
        style.textContent = `
            .dark-mode-toggle {
                background: var(--primary-color, #0073e6);
                color: white;
                padding: 8px 16px;
                border: none;
                border-radius: var(--border-radius, 6px);
                cursor: pointer;
                font-size: var(--font-size, 16px);
            }
            .dark-mode-toggle:hover {
                background: var(--primary-hover, #005bb5);
            }
            :host([dark]) {
                background: black;
                color: white;
            }
        `;

        this.shadowRoot.appendChild(style);
        this.shadowRoot.appendChild(this.button);

        this.loadTheme();
    }

    toggleDarkMode() {
        document.body.classList.toggle("dark-mode");
        const isDarkMode = document.body.classList.contains("dark-mode");
        localStorage.setItem("darkMode", isDarkMode ? "enabled" : "disabled");
        this.updateTheme();
    }

    loadTheme() {
        const darkMode = localStorage.getItem("darkMode");
        if (darkMode === "enabled") {
            document.body.classList.add("dark-mode");
        } else {
            document.body.classList.remove("dark-mode");
        }
        this.updateTheme();
    }

    updateTheme() {
        const isDarkMode = document.body.classList.contains("dark-mode");
        this.button.textContent = isDarkMode ? "Light Mode" : "Dark Mode";
    }
}

customElements.define("custom-dark-mode", CustomDarkMode);
</script>