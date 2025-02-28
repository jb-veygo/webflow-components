/**
 * Web Component: Custom Password Strength Meter
 *
 * How to use in Webflow:
 * 1. Add an "Embed" element inside Webflow.
 * 2. Paste the following HTML:
 *      <custom-password-strength></custom-password-strength>
 * 3. Listen for password strength changes using:
 *      document.querySelector('custom-password-strength').addEventListener('strength-change', (e) => {
 *          console.log('Password Strength:', e.detail.strength);
 *      });
 */

<script>
class CustomPasswordStrength extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });

        this.wrapper = document.createElement("div");
        this.wrapper.classList.add("password-container");

        this.input = document.createElement("input");
        this.input.setAttribute("type", "password");
        this.input.setAttribute("placeholder", "Enter password");
        this.input.classList.add("password-input");

        this.meter = document.createElement("div");
        this.meter.classList.add("password-meter");

        this.strengthText = document.createElement("span");
        this.strengthText.classList.add("strength-text");
        this.strengthText.textContent = "Strength: Weak";

        this.input.addEventListener("input", () => this.updateStrength());

        const style = document.createElement("style");
        style.textContent = `
            .password-container {
                display: flex;
                flex-direction: column;
                gap: 8px;
                width: 100%;
            }
            .password-input {
                width: 100%;
                padding: 8px 12px;
                border: 1px solid var(--input-border, #ccc);
                border-radius: var(--border-radius, 6px);
                font-size: var(--font-size, 16px);
                outline: none;
            }
            .password-input:focus {
                border-color: var(--primary-color, #0073e6);
                box-shadow: 0 0 3px var(--primary-color, #0073e6);
            }
            .password-meter {
                height: 6px;
                width: 100%;
                background: #ddd;
                border-radius: 4px;
                position: relative;
                overflow: hidden;
            }
            .meter-fill {
                height: 100%;
                width: 0%;
                transition: width 0.3s ease-in-out;
            }
            .strength-text {
                font-size: var(--font-size, 14px);
                color: #555;
            }
        `;

        this.shadowRoot.appendChild(style);
        this.shadowRoot.appendChild(this.wrapper);
        this.wrapper.appendChild(this.input);
        this.wrapper.appendChild(this.meter);
        this.wrapper.appendChild(this.strengthText);
    }

    updateStrength() {
        const password = this.input.value;
        const strength = this.calculateStrength(password);

        this.strengthText.textContent = `Strength: ${strength.label}`;
        this.meter.innerHTML = `<div class="meter-fill" style="width: ${strength.percent}%; background: ${strength.color};"></div>`;

        this.dispatchEvent(new CustomEvent("strength-change", {
            detail: { strength: strength.label },
            bubbles: true
        }));
    }

    calculateStrength(password) {
        let score = 0;
        if (password.length > 5) score++;
        if (password.length > 8) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[a-z]/.test(password)) score++;
        if (/\d/.test(password)) score++;
        if (/[\W]/.test(password)) score++;

        const strengthLevels = [
            { label: "Very Weak", percent: 10, color: "red" },
            { label: "Weak", percent: 30, color: "orange" },
            { label: "Moderate", percent: 50, color: "yellow" },
            { label: "Strong", percent: 75, color: "lightgreen" },
            { label: "Very Strong", percent: 100, color: "green" }
        ];

        return strengthLevels[Math.min(score, strengthLevels.length - 1)];
    }
}

customElements.define("custom-password-strength", CustomPasswordStrength);
</script>
