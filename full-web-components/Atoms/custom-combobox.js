class CustomCombobox extends HTMLElement {
    static get observedAttributes() {
        return ["placeholder", "options"];
    }

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.options = [];
        this.filteredOptions = [];
        this.selectedOption = "";
        this.isOpen = false;
        this.render();
    }

    connectedCallback() {
        this.inputField = this.shadowRoot.querySelector("custom-input");
        this.trailingIcon = this.shadowRoot.querySelector(".combobox-icon");
        this.command = this.shadowRoot.querySelector("custom-command");

        this.options = JSON.parse(this.getAttribute("options") || "[]");
        this.filteredOptions = [...this.options];
        this.command.setAttribute("options", JSON.stringify(this.filteredOptions));

        this.inputField.addEventListener("input", this.filterOptions.bind(this));
        this.trailingIcon.addEventListener("click", this.toggleDropdown.bind(this));
        this.command.addEventListener("select", (event) => this.selectOption(event.detail));
    }

    filterOptions(event) {
        const searchTerm = event.detail.toLowerCase();
        this.filteredOptions = this.options.filter(option => option.toLowerCase().includes(searchTerm));
        this.command.setAttribute("options", JSON.stringify(this.filteredOptions));
    }

    toggleDropdown() {
        this.isOpen = !this.isOpen;
        this.command.style.display = this.isOpen ? "block" : "none";
    }

    selectOption(value) {
        this.selectedOption = value;
        this.inputField.setAttribute("value", value);
        this.dispatchEvent(new CustomEvent("change", { detail: value })); // Emit change event for Webflow
        this.toggleDropdown();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                .combobox-wrapper {
                    display: flex;
                    flex-direction: column;
                    width: 100%;
                    max-width: 320px;
                    position: relative;
                }
                .combobox-icon {
                    cursor: pointer;
                    position: absolute;
                    right: 10px;
                    top: 50%;
                    transform: translateY(-50%);
                    z-index: 5;
                }
                custom-command {
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
            <div class="combobox-wrapper">
                <custom-input placeholder="${this.getAttribute("placeholder") || "Search options"}" data-webflow-ignore></custom-input>
                <span class="combobox-icon" role="button" aria-label="Toggle combobox">▼</span>
                <custom-command></custom-command>
            </div>
        `;
    }
}

customElements.define("custom-combobox", CustomCombobox);
