class CustomSelect extends HTMLElement {
    static get observedAttributes() {
        return ["options", "placeholder", "value"];
    }

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.options = [];
        this.selectedValue = this.getAttribute("value") || "";
        this.placeholder = this.getAttribute("placeholder") || "Select an option";
    }

    connectedCallback() {
        this.parseOptions();
        this.render();
        this.setupEvents();
    }

    parseOptions() {
        const optionsAttr = this.getAttribute("options");
        if (optionsAttr) {
            try {
                this.options = JSON.parse(optionsAttr);
            } catch (error) {
                console.error("Invalid JSON format for options attribute", error);
            }
        }
    }

    setupEvents() {
        this.shadowRoot.querySelector(".select-trigger").addEventListener("click", () => {
            this.toggleDropdown();
        });
        this.shadowRoot.querySelectorAll(".select-item").forEach(item => {
            item.addEventListener("click", (event) => {
                this.selectOption(event.target.dataset.value);
            });
        });
    }

    toggleDropdown() {
        const dropdown = this.shadowRoot.querySelector(".select-dropdown");
        dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
    }

    selectOption(value) {
        this.selectedValue = value;
        this.shadowRoot.querySelector(".select-value").textContent = this.options.find(opt => opt.value === value)?.label || this.placeholder;
        this.toggleDropdown();
        this.dispatchEvent(new CustomEvent("change", { detail: value, bubbles: true, composed: true }));
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                .select-container {
                    position: relative;
                    display: flex;
                    
                }
                .select-trigger {
                    flex-grow: 1;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 10px;
                    background: white;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    cursor: pointer;
                }
                .select-dropdown {
                    display: none;
                    position: absolute;
                    width: 100%;
                    background: white;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    margin-top: 5px;
                    z-index: 10;
                }
                .select-item {
                    padding: 10px;
                    cursor: pointer;
                }
                .select-item:hover {
                    background: #f0f0f0;
                }
            </style>
            <div class="select-container">
                <div class="select-trigger">
                    <span class="select-value">${this.placeholder}</span>
                    <span>&#9662;</span>
                </div>
                <div class="select-dropdown">
                    ${this.options.map(opt => `<div class="select-item" data-value="${opt.value}">${opt.label}</div>`).join('')}
                </div>
            </div>
        `;
    }
}

customElements.define("custom-select", CustomSelect);
