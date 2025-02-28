/**
 * Web Component: Custom OTP Autofocus Input
 *
 * How to use in Webflow:
 * 1. Add an "Embed" element inside Webflow.
 * 2. Paste the following HTML:
 *      <custom-otp-autofocus length="6"></custom-otp-autofocus>
 * 3. Modify the "length" attribute to set the number of OTP fields.
 * 4. Listen for the OTP input change event using:
 *      document.querySelector('custom-otp-autofocus').addEventListener('otp-complete', (e) => {
 *          console.log('OTP Entered:', e.detail.value);
 *      });
 */

<script>
class CustomOtpAutofocus extends HTMLElement {
    static get observedAttributes() {
        return ["length"];
    }

    constructor() {
        super();
        this.attachShadow({ mode: "open" });

        this.wrapper = document.createElement("div");
        this.wrapper.classList.add("otp-container");

        this.inputs = [];
        this.length = parseInt(this.getAttribute("length")) || 6;

        for (let i = 0; i < this.length; i++) {
            const input = document.createElement("input");
            input.setAttribute("type", "text");
            input.setAttribute("maxlength", "1");
            input.classList.add("otp-input");
            input.addEventListener("input", (e) => this.handleInput(e, i));
            input.addEventListener("keydown", (e) => this.handleBackspace(e, i));
            this.inputs.push(input);
            this.wrapper.appendChild(input);
        }

        const style = document.createElement("style");
        style.textContent = `
            .otp-container {
                display: flex;
                gap: 8px;
            }
            .otp-input {
                width: 40px;
                height: 40px;
                text-align: center;
                font-size: var(--font-size, 18px);
                border: 1px solid var(--primary-color, #0073e6);
                border-radius: var(--border-radius, 6px);
                outline: none;
            }
            .otp-input:focus {
                border-color: var(--primary-hover, #005bb5);
                box-shadow: 0 0 3px var(--primary-hover, #005bb5);
            }
        `;

        this.shadowRoot.appendChild(style);
        this.shadowRoot.appendChild(this.wrapper);
    }

    handleInput(e, index) {
        if (e.target.value.length === 1 && index < this.length - 1) {
            this.inputs[index + 1].focus();
        }
        this.checkCompletion();
    }

    handleBackspace(e, index) {
        if (e.key === "Backspace" && index > 0 && !e.target.value) {
            this.inputs[index - 1].focus();
        }
    }

    checkCompletion() {
        const otpValue = this.inputs.map(input => input.value).join("");
        if (otpValue.length === this.length) {
            this.dispatchEvent(new CustomEvent("otp-complete", {
                detail: { value: otpValue },
                bubbles: true
            }));
        }
    }
}

customElements.define("custom-otp-autofocus", CustomOtpAutofocus);
</script>
