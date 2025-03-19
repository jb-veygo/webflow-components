class CustomCombobox extends HTMLElement {
    static get observedAttributes() {
        return ["placeholder", "options"];
    }

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        console.log("Initializing CustomCombobox component...");

        Promise.all([
            customElements.whenDefined("custom-popover"),
            customElements.whenDefined("custom-command")
        ]).then(() => {
            console.log("All required components loaded. Initializing...");
            this.options = [];
            this.init();
        });
    }

    init() {
        this.options = JSON.parse(this.getAttribute("options") || "[]");
        console.log("Parsed options:", this.options);
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <div class="combobox-wrapper">
                <custom-popover class="combobox-popover">
                    <button class="combobox-trigger" aria-haspopup="true" aria-expanded="false">
                        <span class="placeholder">${this.getAttribute("placeholder") || "Select an option"}</span>
                    </button>
                    <input type="text" class="combobox-search" placeholder="Search..." aria-label="Search options">
                    <custom-command class="combobox-command"></custom-command>
                </custom-popover>
            </div>
            <style>
                .combobox-wrapper {
                    display: flex;
                    flex-direction: column;
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
            </style>
        `;
        
        this.triggerButton = this.shadowRoot.querySelector(".combobox-trigger");
        this.popover = this.shadowRoot.querySelector("custom-popover");
        this.command = this.shadowRoot.querySelector("custom-command");
        this.searchInput = this.shadowRoot.querySelector(".combobox-search");
        
        // Ensure the popover attribute is not incorrectly set
        if (this.hasAttribute("popover")) {
            console.warn("Removing invalid popover attribute from custom-combobox");
            this.removeAttribute("popover");
        }

        this.command.setAttribute("options", JSON.stringify(this.options));
        this.triggerButton.popoverTargetElement = this.popover;

        console.log("Attaching event listeners...");
        // Event Listeners
        this.triggerButton.addEventListener("click", () => {
            if (this.popover) {
                if (this.popover.hasAttribute("open")) {
                    this.popover.removeAttribute("open");
                } else {
                    this.popover.setAttribute("open", "true");
                }
            }
        });

        this.command.addEventListener("option-selected", (event) => {
            console.log("Handling option selection event...");
            this.triggerButton.querySelector(".placeholder").textContent = event.detail;
            this.command.classList.remove("active");
            this.triggerButton.setAttribute("aria-expanded", "false");
            
            // Dispatch change event
            this.dispatchEvent(new CustomEvent("change", {
                detail: event.detail,
                bubbles: true,
                composed: true
            }));
        });

        this.searchInput.addEventListener("input", () => {
            const searchTerm = this.searchInput.value.toLowerCase();
            const filteredOptions = this.options.filter(option => option.toLowerCase().includes(searchTerm));
            this.command.setAttribute("options", JSON.stringify(filteredOptions));
        });

        console.log("CustomCombobox component loaded successfully.");
    }
}

customElements.define("custom-combobox", CustomCombobox);
