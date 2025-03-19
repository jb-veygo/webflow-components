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
            this.options = JSON.parse(this.getAttribute("options") || "[]");
            console.log("Parsed options:", this.options);
            this.render();
        });
    }

    render() {
        this.shadowRoot.innerHTML = `
            <div class="combobox-wrapper">
                <custom-popover class="combobox-popover">
                    <button class="combobox-trigger" aria-haspopup="true" aria-expanded="false">
                        <span class="placeholder">${this.getAttribute("placeholder") || "Select an option"}</span>
                    </button>
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
        
        this.popover = this.shadowRoot.querySelector("custom-popover");
        this.command = this.shadowRoot.querySelector("custom-command");
        this.triggerButton = this.shadowRoot.querySelector(".combobox-trigger");
        
        this.command.setAttribute("options", JSON.stringify(this.options));

        console.log("Attaching event listeners...");
        // Event Listeners
        this.triggerButton.addEventListener("click", () => {
            const isOpen = this.command.classList.contains("active");
            this.command.classList.toggle("active");
            this.triggerButton.setAttribute("aria-expanded", !isOpen);
        });

        this.command.addEventListener("option-selected", (event) => {
            console.log("Handling option selection event...");
            this.triggerButton.querySelector(".placeholder").textContent = event.detail;
            this.command.classList.remove("active");
            this.triggerButton.setAttribute("aria-expanded", "false");
        });

        console.log("CustomCombobox component loaded successfully.");
    }
}

customElements.define("custom-combobox", CustomCombobox);
