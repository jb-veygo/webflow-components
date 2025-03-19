class CustomCombobox extends HTMLElement {
    static get observedAttributes() {
        return ["placeholder", "options"];
    }

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.options = JSON.parse(this.getAttribute("options") || "[]");
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = '';

        // Create Wrapper
        this.wrapper = document.createElement("div");
        this.wrapper.classList.add("combobox-wrapper");

        // Create Popover Component
        this.popover = document.createElement("div");
        this.popover.classList.add("combobox-popover");

        // Create Input Field (Trigger for Popover)
        this.inputButton = document.createElement("button");
        this.inputButton.classList.add("combobox-trigger");
        this.inputButton.setAttribute("aria-haspopup", "true");
        this.inputButton.setAttribute("aria-expanded", "false");
        this.inputButton.innerHTML = `<span class="placeholder">${this.getAttribute("placeholder") || "Select an option"}</span>`;
        
        // Command Input (for filtering options)
        this.commandInput = document.createElement("input");
        this.commandInput.classList.add("command-input");
        this.commandInput.setAttribute("type", "text");
        this.commandInput.setAttribute("placeholder", "Search...");
        this.commandInput.setAttribute("aria-label", "Search options");
        
        // Dropdown List
        this.commandList = document.createElement("ul");
        this.commandList.classList.add("command-list");
        this.commandList.setAttribute("role", "listbox");
        
        // Populate List Items
        this.updateList();
        
        // Append elements
        this.popover.appendChild(this.inputButton);
        this.popover.appendChild(this.commandInput);
        this.popover.appendChild(this.commandList);
        this.wrapper.appendChild(this.popover);
        this.shadowRoot.appendChild(this.wrapper);
        
        // Styles
        const style = document.createElement("style");
        style.textContent = `
            .combobox-wrapper {
                display: flex;
                flex-direction: column;
                gap: 8px;
                width: 100%;
                position: relative;
            }

            .combobox-trigger {
                display: flex;
                align-items: center;
                justify-content: space-between;
                border: 1px solid #e5e7eb;
                border-radius: 0.5rem;
                padding: 0.75rem;
                background: white;
                cursor: pointer;
                transition: border-color 0.2s ease-in-out;
            }

            .combobox-trigger:focus {
                border-color: #1e40af;
                box-shadow: 0 0 0 2px rgba(30, 64, 175, 0.2);
            }

            .command-input {
                width: 100%;
                padding: 0.5rem;
                font-size: 0.875rem;
                border-radius: 0.375rem;
                border: 1px solid #e5e7eb;
                outline: none;
            }

            .command-list {
                list-style: none;
                margin: 0;
                padding: 0;
                max-height: 200px;
                overflow-y: auto;
                background: white;
                border: 1px solid #e5e7eb;
                border-radius: 0.5rem;
                display: none;
                position: absolute;
                width: 100%;
                z-index: 10;
            }

            .command-list.active {
                display: block;
            }

            .command-list li {
                padding: 0.5rem;
                cursor: pointer;
                transition: background 0.2s;
            }

            .command-list li:hover, .command-list li:focus {
                background: #e0e7ff;
            }

            .command-list li:active {
                background: #d1d5db;
            }
        `;
        
        this.shadowRoot.appendChild(style);
        
        // Event Listeners
        this.inputButton.addEventListener("click", () => {
            this.commandList.classList.toggle("active");
            const isOpen = this.commandList.classList.contains("active");
            this.inputButton.setAttribute("aria-expanded", isOpen);
        });

        this.commandInput.addEventListener("input", () => {
            this.updateList();
        });
    }
    
    updateList() {
        this.commandList.innerHTML = "";
        const searchTerm = this.commandInput.value.toLowerCase();
        
        this.options.forEach(option => {
            if (option.toLowerCase().includes(searchTerm)) {
                const listItem = document.createElement("li");
                listItem.textContent = option;
                listItem.setAttribute("role", "option");
                listItem.tabIndex = 0;
                listItem.addEventListener("click", () => {
                    this.inputButton.querySelector(".placeholder").textContent = option;
                    this.inputButton.setAttribute("aria-expanded", "false");
                    this.commandList.classList.remove("active");
                    this.dispatchEvent(new CustomEvent("change", {
                        detail: option,
                        bubbles: true,
                        composed: true
                    }));
                });
                this.commandList.appendChild(listItem);
            }
        });
    }
}

customElements.define("custom-combobox", CustomCombobox);