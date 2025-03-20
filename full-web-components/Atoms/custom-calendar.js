class CustomCalendar extends HTMLElement {
    static get observedAttributes() {
        return ["mode", "selected"];
    }

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.today = new Date();
        this.currentMonth = this.today.getMonth();
        this.currentYear = this.today.getFullYear();
        this.selectedDates = [];
        this.mode = this.getAttribute("mode") || "single";
        this.render();
    }

    connectedCallback() {
        this.shadowRoot.querySelector(".prev-month").addEventListener("click", () => this.changeMonth(-1));
        this.shadowRoot.querySelector(".next-month").addEventListener("click", () => this.changeMonth(1));
        this.shadowRoot.querySelector(".calendar-grid").addEventListener("click", (event) => this.handleDateSelection(event));
    }

    changeMonth(step) {
        this.currentMonth += step;
        if (this.currentMonth < 0) {
            this.currentMonth = 11;
            this.currentYear--;
        } else if (this.currentMonth > 11) {
            this.currentMonth = 0;
            this.currentYear++;
        }
        this.renderCalendar();
    }

    handleDateSelection(event) {
        if (!event.target.classList.contains("calendar-day")) return;
        const selectedDate = event.target.dataset.date;
        if (this.mode === "single") {
            this.selectedDates = [selectedDate];
        } else if (this.mode === "multi") {
            if (this.selectedDates.includes(selectedDate)) {
                this.selectedDates = this.selectedDates.filter(date => date !== selectedDate);
            } else {
                this.selectedDates.push(selectedDate);
            }
        } else if (this.mode === "range") {
            if (this.selectedDates.length === 0 || this.selectedDates.length === 2) {
                this.selectedDates = [selectedDate];
            } else {
                this.selectedDates.push(selectedDate);
                this.selectedDates.sort();
            }
        }
        this.dispatchEvent(new CustomEvent("date-select", { detail: this.selectedDates }));
        this.renderCalendar();
    }

    renderCalendar() {
        const monthDays = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
        const startDay = new Date(this.currentYear, this.currentMonth, 1).getDay();
        let daysHTML = "";

        for (let i = 0; i < startDay; i++) {
            daysHTML += `<div class="calendar-day empty"></div>`;
        }
        
        for (let day = 1; day <= monthDays; day++) {
            const dateStr = `${day}-${this.currentMonth + 1}-${this.currentYear}`;
            const isSelected = this.selectedDates.includes(dateStr);
            daysHTML += `<div class="calendar-day ${isSelected ? 'selected' : ''}" data-date="${dateStr}">${day}</div>`;
        }
        
        this.shadowRoot.querySelector(".calendar-grid").innerHTML = daysHTML;
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                .calendar-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    padding: 10px;
                    width: 280px;
                    background: white;
                }
                .calendar-header {
                    display: flex;
                    justify-content: space-between;
                    width: 100%;
                    padding: 8px 0;
                }
                .calendar-grid {
                    display: grid;
                    grid-template-columns: repeat(7, 1fr);
                    gap: 4px;
                    width: 100%;
                }
                .calendar-day {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 8px;
                    border-radius: 4px;
                    cursor: pointer;
                }
                .calendar-day.selected {
                    background: #3b82f6;
                    color: white;
                }
                .calendar-day:hover {
                    background: #e5e7eb;
                }
                .calendar-day.empty {
                    visibility: hidden;
                }
            </style>
            <div class="calendar-container">
                <div class="calendar-header">
                    <button class="prev-month">◀</button>
                    <span class="calendar-title">${new Date(this.currentYear, this.currentMonth).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}</span>
                    <button class="next-month">▶</button>
                </div>
                <div class="calendar-grid"></div>
            </div>
        `;
        this.renderCalendar();
    }
}

customElements.define("custom-calendar", CustomCalendar);
