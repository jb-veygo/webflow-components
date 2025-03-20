class CustomDatePicker extends HTMLElement {
    static get observedAttributes() {
        return ["mode", "selected"];
    }

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.selectedDate = "";
        this.mode = this.getAttribute("mode") || "single";
        this.render();
    }

    connectedCallback() {
        this.inputField = this.shadowRoot.querySelector("custom-input");
        this.trailingIcon = this.shadowRoot.querySelector(".date-picker-icon");
        this.calendar = this.shadowRoot.querySelector("custom-calendar");
        this.calendar.style.display = "none"; // Remove popover reference

        this.inputField.addEventListener("click", (event) => {
            event.stopPropagation();
            this.toggleCalendar();
        });
        this.trailingIcon.addEventListener("click", (event) => {
            event.stopPropagation();
            this.toggleCalendar();
        });
        document.addEventListener("click", (event) => this.handleOutsideClick(event));
        this.calendar.addEventListener("date-select", (event) => this.handleDateSelection(event.detail));
    }

    toggleCalendar() {
        this.isOpen = !this.isOpen;
        if (this.calendar) {
            this.calendar.style.display = this.isOpen ? "block" : "none";
            this.calendar.setAttribute("aria-hidden", !this.isOpen);
        } else {
            console.error("custom-calendar element not found");
        }
    }

    handleDateSelection(selected) {
        if (this.mode === "single") {
            this.selectedDate = selected[0];
        } else if (this.mode === "range" || this.mode === "multi") {
            this.selectedDate = selected.join(", ");
        }
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
                .date-picker-popover {
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
                .date-picker-popover[aria-hidden="false"] {
                    visibility: visible;
                    opacity: 1;
                }
            </style>
            <div class="date-picker-wrapper">
                <custom-input placeholder="Select date"></custom-input>
                <span class="date-picker-icon">📅</span>
                <div class="date-picker-popover">
                    <custom-calendar mode="${this.mode}"></custom-calendar>
                </div>
            </div>
        `;
    }
}

customElements.define("custom-date-picker", CustomDatePicker);
