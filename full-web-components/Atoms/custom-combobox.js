class CustomCombobox extends HTMLElement {
    static get observedAttributes() {
        return ["placeholder", "options", "multiple"];
    }

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.options = JSON.parse(this.getAttribute("options") || "[]"); // Ensure options are set on initialization
        this.filteredOptions = [];
        this.selectedOptions = [];
        this.activeIndex = -1;
        this.isOpen = false;
        this.popover = null;
        this.listbox = null;
        this.triggerButton = null;
        this.render();
    }

    connectedCallback() {
        this.searchInput = this.shadowRoot.querySelector(".combobox-search");
        this.popover = this.shadowRoot.querySelector(".combobox-popover");
        this.listbox = this.shadowRoot.querySelector(".combobox-list");
        this.triggerButton = this.shadowRoot.querySelector(".combobox-trigger");

        if (!this.searchInput || !this.popover || !this.listbox || !this.triggerButton) {
            console.error("CustomCombobox: Missing required elements in shadow DOM");
            return;
        }

        this.popover.style.display = "none"; // Ensure it's hidden initially
        this.renderOptions();
        
        this.searchInput.addEventListener("input", this.filterOptions.bind(this));
        this.searchInput.addEventListener("keydown", this.handleKeyboardNavigation.bind(this));
        this.triggerButton.addEventListener("click", this.toggleDropdown.bind(this));
    }

    filterOptions() {
        const searchTerm = this.searchInput.value.toLowerCase();
        this.filteredOptions = this.options.filter(option => option.toLowerCase().includes(searchTerm));
        this.renderOptions();
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
        if (!this.popover || !this.triggerButton) return;
        
        this.isOpen = !this.isOpen;
        this.popover.style.display = this.isOpen ? "block" : "none";
        this.triggerButton.setAttribute("aria-expanded", this.isOpen.toString());
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
        this.toggleDropdown();
    }

    renderOptions() {
        this.listbox.innerHTML = "";
        if (this.filteredOptions.length === 0) {
            this.listbox.innerHTML = "<div class='combobox-option' style='color: #9ca3af; padding: 8px;'>No options found</div>";
            return;
        }
        this.filteredOptions.forEach((option, index) => {
            const optionElement = document.createElement("div");
            optionElement.classList.add("combobox-option");
            optionElement.textContent = option;
            optionElement.tabIndex = 0;
            optionElement.setAttribute("role", "option");
            optionElement.setAttribute("aria-selected", index === this.activeIndex ? "true" : "false");
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
                    transition: opacity 0.2s ease-in-out;
                }
                .combobox-popover[open] {
                    opacity: 1;
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
