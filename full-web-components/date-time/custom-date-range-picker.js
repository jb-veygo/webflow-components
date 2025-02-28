// Placeholder for custom-date-range-picker.js
/**
 * Web Component: Custom Date Range Picker
 *
 * How to use in Webflow:
 * 1. Add an "Embed" element inside Webflow.
 * 2. Paste the following HTML:
 *      <custom-date-range-picker></custom-date-range-picker>
 * 3. Listen for date range selection using:
 *      document.querySelector('custom-date-range-picker').addEventListener('range-selected', (e) => {
 *          console.log('Selected range:', e.detail.start, 'to', e.detail.end);
 *      });
 */

<script>
class CustomDateRangePicker extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });

        this.wrapper = document.createElement("div");
        this.wrapper.classList.add("date-range-picker-wrapper");

        this.startInput = document.createElement("input");
        this.startInput.setAttribute("type", "text");
        this.startInput.setAttribute("placeholder", "Start Date");
        this.startInput.classList.add("date-input");

        this.endInput = document.createElement("input");
        this.endInput.setAttribute("type", "text");
        this.endInput.setAttribute("placeholder", "End Date");
        this.endInput.classList.add("date-input");

        this.calendar = document.createElement("div");
        this.calendar.classList.add("calendar");
        this.calendar.style.display = "none";

        this.currentDate = new Date();
        this.selectedStart = null;
        this.selectedEnd = null;
        this.activeField = null;
        this.renderCalendar();

        this.startInput.addEventListener("click", () => this.openCalendar("start"));
        this.endInput.addEventListener("click", () => this.openCalendar("end"));

        this.wrapper.appendChild(this.startInput);
        this.wrapper.appendChild(this.endInput);
        this.wrapper.appendChild(this.calendar);

        const style = document.createElement("style");
        style.textContent = `
            .date-range-picker-wrapper {
                position: relative;
                display: flex;
                gap: 10px;
            }
            .date-input {
                width: 120px;
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
            .in-range {
                background: var(--range-bg, #d0e6ff);
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
            
            const dateValue = new Date(year, month, day);
            if (this.selectedStart && this.selectedEnd) {
                if (dateValue >= this.selectedStart && dateValue <= this.selectedEnd) {
                    dayElement.classList.add("in-range");
                }
            }
            if (this.selectedStart && this.selectedStart.toDateString() === dateValue.toDateString()) {
                dayElement.classList.add("selected");
            }
            if (this.selectedEnd && this.selectedEnd.toDateString() === dateValue.toDateString()) {
                dayElement.classList.add("selected");
            }

            daysContainer.appendChild(dayElement);
        }

        this.calendar.appendChild(daysContainer);
    }

    openCalendar(field) {
        this.activeField = field;
        this.calendar.style.display = "block";
    }

    selectDate(year, month, day) {
        const selectedDate = new Date(year, month, day);

        if (this.activeField === "start") {
            this.selectedStart = selectedDate;
            this.startInput.value = this.selectedStart.toISOString().split("T")[0];

            if (this.selectedEnd && this.selectedEnd < this.selectedStart) {
                this.selectedEnd = null;
                this.endInput.value = "";
            }
        } else if (this.activeField === "end") {
            this.selectedEnd = selectedDate;
            this.endInput.value = this.selectedEnd.toISOString().split("T")[0];

            if (this.selectedStart && this.selectedStart > this.selectedEnd) {
                this.selectedStart = null;
                this.startInput.value = "";
            }
        }

        if (this.selectedStart && this.selectedEnd) {
            this.dispatchEvent(new CustomEvent("range-selected", {
                detail: { start: this.startInput.value, end: this.endInput.value },
                bubbles: true
            }));
        }

        this.renderCalendar();
        this.calendar.style.display = "none";
    }

    changeMonth(offset) {
        this.currentDate.setMonth(this.currentDate.getMonth() + offset);
        this.renderCalendar();
    }
}

customElements.define("custom-date-range-picker", CustomDateRangePicker);
</script>