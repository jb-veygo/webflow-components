class CustomDatePicker extends HTMLElement {
    static get observedAttributes() {
        return ["mode", "selected"];
    }

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.selectedDate = "";
        this.mode = this.getAttribute("mode") || "single";
        this.isOpen = false; // Remove popover reference
        this.render();
        this.calendarContainer = null;
    }

    connectedCallback() {
        this.inputField = this.shadowRoot.querySelector("custom-input");
        this.trailingIcon = this.shadowRoot.querySelector(".date-picker-icon");
        this.calendar = this.shadowRoot.querySelector("custom-calendar");
        this.calendarContainer = this.shadowRoot.querySelector(".calendar-container");
        if (!this.inputField || !this.trailingIcon || !this.calendar || !this.calendarContainer) {
            console.error("One or more elements not found in the custom-date-picker component.");
            return;
        }

        this.inputField.addEventListener("click", (event) => {
            console.log("Click event triggered on input field");
            event.stopPropagation();
            this.toggleCalendar();
        });
        this.trailingIcon.addEventListener("click", (event) => {
            console.log("Click event triggered on icon");
            event.stopPropagation();
            this.toggleCalendar();
        });
        document.addEventListener("click", (event) => this.handleOutsideClick(event));
        this.calendar.addEventListener("date-select", (event) => this.handleDateSelection(event.detail));
    }

    toggleCalendar() {
        console.log("Toggling calendar. Current state:", this.isOpen);
        this.isOpen = !this.isOpen;
        if (this.calendar && this.calendarContainer) {
            if (this.isOpen) {
                this.calendar.style.visibility = "visible";
                this.calendar.style.opacity = "1";
                this.calendarContainer.style.visibility = "visible";
                this.calendarContainer.style.opacity = "1";
            } else {
                this.calendar.style.visibility = "hidden";
                this.calendar.style.opacity = "0";
                this.calendarContainer.style.visibility = "hidden";
                this.calendarContainer.style.opacity = "0";
            }
        } else {
            console.error("custom-calendar or calendar-container element not found");
        }
    }

    handleDateSelection(selected) {
        console.log("Date selected:", selected);
        if (this.mode === "single") {
            this.selectedDate = selected[0];
        } else if (this.mode === "range" || this.mode === "multi") {
            this.selectedDate = selected.join(", ");
        }
        console.log("Setting input value to:", this.selectedDate);
        this.inputField.setAttribute("value", this.selectedDate);
        this.dispatchEvent(new CustomEvent("change", { detail: this.selectedDate }));
        this.toggleCalendar();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                .date-picker-wrapper {
                    position: relative;
                    display: flex;
                    align-items: center;
                    width: 100%;
                    max-width: 320px;
                }
                .date-picker-icon {
                    cursor: pointer;
                    position: absolute;
                    right: 10px;
                    top: 50%;
                    transform: translateY(-50%);
                    z-index: 5;
                }
                .calendar-container {
                    visibility: hidden;
                    opacity: 0;
                    transition: opacity 0.2s ease, visibility 0.2s ease;
                    position: absolute;
                    top: 100%;
                    left: 0;
                    width: 100%;
                    z-index: 10;
                    background: white;
                    border: 1px solid #d1d5db;
                    border-radius: 6px;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                }
                .calendar-container[aria-hidden="false"] {
                    visibility: visible;
                    opacity: 1;
                }
            </style>
            <div class="date-picker-wrapper">
                <custom-input placeholder="Select date"></custom-input>
                <span class="date-picker-icon">📅</span>
                <div class="calendar-container">
                    <custom-calendar mode="${this.mode}"></custom-calendar>
                </div>
            </div>
        `;
    }
}

customElements.define("custom-date-picker", CustomDatePicker);
