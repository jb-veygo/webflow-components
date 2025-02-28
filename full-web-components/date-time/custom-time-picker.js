/**
 * Web Component: Custom Time Picker
 *
 * How to use in Webflow:
 * 1. Add an "Embed" element inside Webflow.
 * 2. Paste the following HTML:
 *      <custom-time-picker></custom-time-picker>
 * 3. Listen for time selection using:
 *      document.querySelector('custom-time-picker').addEventListener('time-selected', (e) => {
 *          console.log('Selected time:', e.detail.time);
 *      });
 */

<script>
class CustomTimePicker extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });

        this.wrapper = document.createElement("div");
        this.wrapper.classList.add("time-picker-wrapper");

        this.input = document.createElement("input");
        this.input.setAttribute("type", "text");
        this.input.setAttribute("placeholder", "Select a time");
        this.input.classList.add("time-input");
        this.input.addEventListener("click", () => this.toggleDropdown());

        this.dropdown = document.createElement("div");
        this.dropdown.classList.add("time-dropdown");
        this.dropdown.style.display = "none";

        this.populateTimes();

        this.wrapper.appendChild(this.input);
        this.wrapper.appendChild(this.dropdown);

        const style = document.createElement("style");
        style.textContent = `
            .time-picker-wrapper {
                position: relative;
                display: inline-block;
            }
            .time-input {
                width: 120px;
                padding: 8px;
                border: 1px solid var(--input-border, #ccc);
                border-radius: var(--border-radius, 6px);
                cursor: pointer;
                font-size: var(--font-size, 16px);
            }
            .time-dropdown {
                position: absolute;
                top: 100%;
                left: 0;
                background: white;
                border: 1px solid var(--input-border, #ccc);
                border-radius: var(--border-radius, 6px);
                box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
                z-index: 10;
                padding: 5px;
                max-height: 200px;
                overflow-y: auto;
                width: 120px;
            }
            .time-option {
                padding: 6px;
                cursor: pointer;
                text-align: center;
                border-radius: 4px;
            }
            .time-option:hover {
                background: var(--primary-hover, #e2e6ea);
            }
            .selected {
                background: var(--primary-color, #0073e6);
                color: white;
            }
        `;

        this.shadowRoot.appendChild(style);
        this.shadowRoot.appendChild(this.wrapper);
    }

    populateTimes() {
        const times = [];
        for (let hour = 5; hour <= 22; hour++) {
            for (let min = 0; min < 60; min += 30) {
                const formattedHour = hour < 10 ? `0${hour}` : hour;
                const formattedMin = min === 0 ? "00" : min;
                times.push(`${formattedHour}:${formattedMin}`);
            }
        }

        times.forEach(time => {
            const timeElement = document.createElement("div");
            timeElement.classList.add("time-option");
            timeElement.textContent = time;
            timeElement.addEventListener("click", () => this.selectTime(time));
            this.dropdown.appendChild(timeElement);
        });
    }

    selectTime(time) {
        this.input.value = time;
        this.dropdown.style.display = "none";

        this.dispatchEvent(new CustomEvent("time-selected", {
            detail: { time },
            bubbles: true
        }));
    }

    toggleDropdown() {
        this.dropdown.style.display = this.dropdown.style.display === "none" ? "block" : "none";
    }
}

customElements.define("custom-time-picker", CustomTimePicker);
</script>