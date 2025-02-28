/**
 * Web Component: Custom Date Picker
 *
 * How to use in Webflow:
 * 1. Add an "Embed" element inside Webflow.
 * 2. Paste the following HTML:
 *      <custom-date-picker></custom-date-picker>
 * 3. Listen for date selection using:
 *      document.querySelector('custom-date-picker').addEventListener('date-selected', (e) => {
 *          console.log('Selected date:', e.detail.date);
 *      });
 */

<script>
class CustomDatePicker extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });

        this.wrapper = document.createElement("div");
        this.wrapper.classList.add("date-picker-wrapper");

        this.input = document.createElement("input");
        this.input.setAttribute("type", "text");
        this.input.setAttribute("placeholder", "Select a date");
        this.input.classList.add("date-input");
        this.input.addEventListener("click", () => this.toggleCalendar());

        this.calendar = document.createElement("div");
        this.calendar.classList.add("calendar");
        this.calendar.style.display = "none";

        this.currentDate = new Date();
        this.selectedDate = null;
        this.renderCalendar();

        this.wrapper.appendChild(this.input);
        this.wrapper.appendChild(this.calendar);

        const style = document.createElement("style");
        style.textContent = `
            .date-picker-wrapper {
                position: relative;
                display: inline-block;
            }
            .date-input {
                width: 100%;
                padding: 8px;
                border: 1px solid var(--input-border, #ccc);
                border-radius: var(--border-radius, 6px);
                cursor: pointer;
                font-size: var(--font-size, 16px);
            }
            .calendar {
                position: absolute;
                top: 100%;
                left: 0;
                background: white;
                border: 1px solid var(--input-border, #ccc);
                border-radius: var(--border-radius, 6px);
                box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
                z-index: 10;
                padding: 10px;
                display: flex;
                flex-direction: column;
                width: 250px;
            }
            .calendar-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 8px;
            }
            .calendar-days {
                display: grid;
                grid-template-columns: repeat(7, 1fr);
                gap: 5px;
                margin-top: 10px;
            }
            .day {
                padding: 8px;
                cursor: pointer;
                text-align: center;
                border-radius: 4px;
            }
            .day:hover {
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

    renderCalendar() {
        this.calendar.innerHTML = "";
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();

        const header = document.createElement("div");
        header.classList.add("calendar-header");

        const prevButton = document.createElement("button");
        prevButton.textContent = "◀";
        prevButton.addEventListener("click", () => this.changeMonth(-1));

        const monthLabel = document.createElement("span");
        monthLabel.textContent = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(this.currentDate);

        const nextButton = document.createElement("button");
        nextButton.textContent = "▶";
        nextButton.addEventListener("click", () => this.changeMonth(1));

        header.appendChild(prevButton);
        header.appendChild(monthLabel);
        header.appendChild(nextButton);
        this.calendar.appendChild(header);

        const daysContainer = document.createElement("div");
        daysContainer.classList.add("calendar-days");

        const firstDay = new Date(year, month, 1).getDay();
        const lastDate = new Date(year, month + 1, 0).getDate();

        for (let i = 0; i < firstDay; i++) {
            const emptyDiv = document.createElement("div");
            daysContainer.appendChild(emptyDiv);
        }

        for (let day = 1; day <= lastDate; day++) {
            const dayElement = document.createElement("div");
            dayElement.classList.add("day");
            dayElement.textContent = day;
            dayElement.addEventListener("click", () => this.selectDate(year, month, day));
            daysContainer.appendChild(dayElement);
        }

        this.calendar.appendChild(daysContainer);
    }

    selectDate(year, month, day) {
        this.shadowRoot.querySelectorAll(".day").forEach(el => el.classList.remove("selected"));
        event.target.classList.add("selected");

        this.selectedDate = new Date(year, month, day);
        this.input.value = this.selectedDate.toISOString().split("T")[0];
        this.calendar.style.display = "none";

        this.dispatchEvent(new CustomEvent("date-selected", {
            detail: { date: this.input.value },
            bubbles: true
        }));
    }

    changeMonth(offset) {
        this.currentDate.setMonth(this.currentDate.getMonth() + offset);
        this.renderCalendar();
    }

    toggleCalendar() {
        this.calendar.style.display = this.calendar.style.display === "none" ? "block" : "none";
    }
}

customElements.define("custom-date-picker", CustomDatePicker);
</script>