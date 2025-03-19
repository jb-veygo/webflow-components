class CustomCombobox extends HTMLElement {
    static get observedAttributes() {
        return ["placeholder", "options", "multiple"];
    }

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.options = [];
        this.selectedOptions = [];
        this.activeIndex = -1;
        this.isOpen = false;
        this.render();
    }

    connectedCallback() {
        this.searchInput = this.shadowRoot.querySelector(".combobox-search");
        this.popover = this.shadowRoot.querySelector(".combobox-popover");
        this.listbox = this.shadowRoot.querySelector(".combobox-list");
        this.triggerButton = this.shadowRoot.querySelector(".combobox-trigger");
        
        this.searchInput.addEventListener("input", this.filterOptions.bind(this));
        this.searchInput.addEventListener("keydown", this.handleKeyboardNavigation.bind(this));
        this.triggerButton.addEventListener("click", this.toggleDropdown.bind(this));
    }

    filterOptions() {
        const searchTerm = this.searchInput.value.toLowerCase();
        const filteredOptions = this.options.filter(option => option.toLowerCase().includes(searchTerm));
        this.renderOptions(filteredOptions);
    }

    handleKeyboardNavigation(event) {
        const options = Array.from(this.listbox.querySelectorAll(".combobox-option"));
        if (event.key === "ArrowDown") {
            event.preventDefault();
            this.activeIndex = (this.activeIndex + 1) % options.length;
            options[this.activeIndex]?.focus();
        } else if (event.key === "ArrowUp") {
            event.preventDefault();
            this.activeIndex = (this.activeIndex - 1 + options.length) % options.length;
            options[this.activeIndex]?.focus();
        } else if (event.key === "Enter" && this.activeIndex >= 0) {
            event.preventDefault();
            this.selectOption(options[this.activeIndex].textContent);
        }
    }

    toggleDropdown() {
        this.isOpen = !this.isOpen;
        this.popover.setAttribute("open", this.isOpen);
    }

    selectOption(value) {
        if (this.hasAttribute("multiple")) {
            this.selectedOptions.push(value);
        } else {
            this.selectedOptions = [value];
            this.isOpen = false;
        }
        this.searchInput.value = this.selectedOptions.join(", ");
        this.dispatchEvent(new CustomEvent("change", { detail: this.selectedOptions }));
    }

    renderOptions(filteredOptions = this.options) {
        this.listbox.innerHTML = "";
        filteredOptions.forEach(option => {
            const optionElement = document.createElement("div");
            optionElement.classList.add("combobox-option");
            optionElement.textContent = option;
            optionElement.tabIndex = 0;
            optionElement.addEventListener("click", () => this.selectOption(option));
            this.listbox.appendChild(optionElement);
        });
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
                .combobox-trigger {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    border: 1px solid #d1d5db;
                    border-radius: 6px;
                    padding: 8px;
                    background: white;
                    cursor: pointer;
                }
                .combobox-popover {
                    display: none;
                    position: absolute;
                    top: 100%;
                    left: 0;
                    width: 100%;
                    background: white;
                    border: 1px solid #d1d5db;
                    border-radius: 6px;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    z-index: 10;
                }
                .combobox-popover[open] {
                    display: block;
                }
                .combobox-option {
                    padding: 8px 12px;
                    cursor: pointer;
                    transition: background 0.2s;
                }
                .combobox-option:hover {
                    background: #f3f4f6;
                }
            </style>
            <div class="combobox-wrapper">
                <button class="combobox-trigger" aria-haspopup="listbox" aria-expanded="false">
                    <input type="text" class="combobox-search" placeholder="${this.getAttribute("placeholder") || "Search options"}" autocomplete="off" aria-controls="combobox-list">
                </button>
                <div class="combobox-popover">
                    <div id="combobox-list" class="combobox-list" role="listbox"></div>
                </div>
            </div>
        `;
    }
}

customElements.define("custom-combobox", CustomCombobox);
