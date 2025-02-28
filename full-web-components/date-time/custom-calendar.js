// Placeholder for custom-calendar.js
/**
 * Web Component: Custom Calendar
 *
 * How to use in Webflow:
 * 1. Add an "Embed" element inside Webflow.
 * 2. Paste the following HTML:
 *      <custom-calendar></custom-calendar>
 * 3. Listen for date selection using:
 *      document.querySelector('custom-calendar').addEventListener('date-selected', (e) => {
 *          console.log('Selected date:', e.detail.date);
 *      });
 */

<script>
class CustomCalendar extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });

        this.wrapper = document.createElement("div");
        this.wrapper.classList.add("calendar-wrapper");

        this.header = document.createElement("div");
        this.header.classList.add("calendar-header");

        this.prevButton = document.createElement("button");
        this.prevButton.textContent = "◀";
        this.prevButton.addEventListener("click", () => this.changeMonth(-1));

        this.nextButton = document.createElement("button");
        this.nextButton.textContent = "▶";
        this.nextButton.addEventListener("click", () => this.changeMonth(1));

        this.monthLabel = document.createElement("span");
        this.header.appendChild(this.prevButton);
        this.header.appendChild(this.monthLabel);
        this.header.appendChild(this.nextButton);

        this.daysContainer = document.createElement("div");
        this.daysContainer.classList.add("calendar-days");

        this.wrapper.appendChild(this.header);
        this.wrapper.appendChild(this.daysContainer);

        this.currentDate = new Date();
        this.renderCalendar();

        const style = document.createElement("style");
        style.textContent = `
            .calendar-wrapper {
                width: 280px;
                background: var(--calendar-bg, white);
                border-radius: var(--border-radius, 8px);
                padding: 10px;
                box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
                text-align: center;
            }
            .calendar-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 10px;
                font-size: var(--font-size, 16px);
            }
            .calendar-header button {
                background: none;
                border: none;
                cursor: pointer;
                font-size: 18px;
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
        this.daysContainer.innerHTML = "";
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();

        this.monthLabel.textContent = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(this.currentDate);

        const firstDay = new Date(year, month, 1).getDay();
        const lastDate = new Date(year, month + 1, 0).getDate();

        for (let i = 0; i < firstDay; i++) {
            const emptyDiv = document.createElement("div");
            this.daysContainer.appendChild(emptyDiv);
        }

        for (let day = 1; day <= lastDate; day++) {
            const dayElement = document.createElement("div");
            dayElement.classList.add("day");
            dayElement.textContent = day;
            dayElement.addEventListener("click", () => this.selectDate(year, month, day));
            this.daysContainer.appendChild(dayElement);
        }
    }

    selectDate(year, month, day) {
        this.shadowRoot.querySelectorAll(".day").forEach(el => el.classList.remove("selected"));
        event.target.classList.add("selected");

        const selectedDate = new Date(year, month, day);
        this.dispatchEvent(new CustomEvent("date-selected", {
            detail: { date: selectedDate.toISOString().split("T")[0] },
            bubbles: true
        }));
    }

    changeMonth(offset) {
        this.currentDate.setMonth(this.currentDate.getMonth() + offset);
        this.renderCalendar();
    }
}

customElements.define("custom-calendar", CustomCalendar);
</script>