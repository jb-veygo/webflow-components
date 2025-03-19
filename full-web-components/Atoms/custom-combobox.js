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
            this.selectedOptions = [];
            this.inputValue = "";
            this.labelText = this.getAttribute("label") || "Search options";
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
                <div class="Polaris-Labelled--hidden">
                    <div class="Polaris-Labelled__LabelWrapper">
                        <div class="Polaris-Label">
                            <label id="combobox-label" for="combobox-input" class="Polaris-Label__Text">
                                <span class="Polaris-Text--root Polaris-Text--bodyMd">${this.labelText}</span>
                            </label>
                        </div>
                    </div>
                    <div class="Polaris-Connected">
                        <div class="Polaris-Connected__Item Polaris-Connected__Item--primary">
                            <div class="Polaris-TextField">
                                <div class="Polaris-TextField__Prefix Polaris-TextField__PrefixIcon" id="combobox-input-Prefix">
                                    <span class="Polaris-Text--root Polaris-Text--bodyMd">
                                        <span class="Polaris-Icon">
                                            <svg viewBox="0 0 20 20" class="Polaris-Icon__Svg" focusable="false" aria-hidden="true">
                                                <path fill-rule="evenodd" d="M12.323 13.383a5.5 5.5 0 1 1 1.06-1.06l2.897 2.897a.75.75 0 1 1-1.06 1.06l-2.897-2.897Zm.677-4.383a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z"></path>
                                            </svg>
                                        </span>
                                    </span>
                                </div>
                                <input id="combobox-input" role="combobox" placeholder="${this.getAttribute("placeholder") || "Search options"}" autocomplete="off" class="Polaris-TextField__Input" type="text" aria-labelledby="combobox-label combobox-input-Prefix" aria-invalid="false" aria-autocomplete="list" aria-expanded="false" data-1p-ignore="true" data-lpignore="true" data-form-type="other" value="" tabindex="0" aria-controls="combobox-list" aria-owns="combobox-list" data-state="closed">
                                <div class="Polaris-TextField__Backdrop"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <custom-popover class="combobox-popover">
                    <custom-command id="combobox-list" class="combobox-command"></custom-command>
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

        this.searchInput.addEventListener("input", () => {
            const searchTerm = this.searchInput.value.toLowerCase();
            this.inputValue = searchTerm;
            
            if (!searchTerm) {
                this.command.setAttribute("options", JSON.stringify(this.options));
                return;
            }
            
            const filteredOptions = this.options.filter(option => option.toLowerCase().includes(searchTerm));
            this.command.setAttribute("options", JSON.stringify(filteredOptions));
        });

        this.command.addEventListener("option-selected", (event) => {
            console.log("Handling option selection event...");
            this.selectedOptions = [event.detail];
            this.inputValue = event.detail;
            this.searchInput.value = event.detail;
            
            this.command.classList.remove("active");
            this.triggerButton.setAttribute("aria-expanded", "false");
            
            // Dispatch change event
            this.dispatchEvent(new CustomEvent("change", {
                detail: event.detail,
                bubbles: true,
                composed: true
            }));
        });

        this.searchInput.id = "combobox-input";
        this.searchInput.setAttribute("aria-controls", "combobox-list");
        this.searchInput.setAttribute("aria-owns", "combobox-list");

        console.log("CustomCombobox component loaded successfully.");
    }
}

customElements.define("custom-combobox", CustomCombobox);
