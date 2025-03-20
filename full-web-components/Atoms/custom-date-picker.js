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
        this.calendar = this.shadowRoot.querySelector("custom-calendar");
        this.popover = this.shadowRoot.querySelector(".date-picker-popover");
        
        this.inputField.addEventListener("focus", () => this.toggleCalendar(true));
        this.inputField.addEventListener("blur", () => setTimeout(() => this.toggleCalendar(false), 200));
        this.calendar.addEventListener("date-select", (event) => this.handleDateSelection(event.detail));
    }

    toggleCalendar(open) {
        this.popover.style.display = open ? "block" : "none";
    }

    handleDateSelection(selected) {
        if (this.mode === "single") {
            this.selectedDate = selected[0];
        } else if (this.mode === "range" || this.mode === "multi") {
            this.selectedDate = selected.join(", ");
        }
        this.inputField.setAttribute("value", this.selectedDate);
        this.dispatchEvent(new CustomEvent("change", { detail: this.selectedDate }));
        this.toggleCalendar(false);
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                .date-picker-wrapper {
                    position: relative;
                    display: inline-block;
                    width: 100%;
                }
                .date-picker-popover {
                    display: none;
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
            </style>
            <div class="date-picker-wrapper">
                <custom-input placeholder="Select date"></custom-input>
                <div class="date-picker-popover">
                    <custom-calendar mode="${this.mode}"></custom-calendar>
                </div>
            </div>
        `;
    }
}

customElements.define("custom-date-picker", CustomDatePicker);
