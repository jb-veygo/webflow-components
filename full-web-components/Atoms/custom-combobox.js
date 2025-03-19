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
        this.popover = document.createElement("custom-popover");
        this.popover.classList.add("combobox-popover");

        // Create Command Component
        this.command = document.createElement("custom-command");
        this.command.classList.add("combobox-command");
        this.command.setAttribute("options", JSON.stringify(this.options));

        // Create Trigger Button
        this.triggerButton = document.createElement("button");
        this.triggerButton.classList.add("combobox-trigger");
        this.triggerButton.setAttribute("aria-haspopup", "true");
        this.triggerButton.setAttribute("aria-expanded", "false");
        this.triggerButton.innerHTML = `<span class="placeholder">${this.getAttribute("placeholder") || "Select an option"}</span>`;
        
        // Append elements
        this.popover.appendChild(this.triggerButton);
        this.popover.appendChild(this.command);
        this.wrapper.appendChild(this.popover);
        this.shadowRoot.appendChild(this.wrapper);
        
        // Styles
        const style = document.createElement("style");
        style.textContent = `
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
        `;
        
        this.shadowRoot.appendChild(style);
        
        // Event Listeners
        this.triggerButton.addEventListener("click", () => {
            const isOpen = this.command.classList.contains("active");
            this.command.classList.toggle("active");
            this.triggerButton.setAttribute("aria-expanded", !isOpen);
        });

        this.command.addEventListener("option-selected", (event) => {
            this.triggerButton.querySelector(".placeholder").textContent = event.detail;
            this.command.classList.remove("active");
            this.triggerButton.setAttribute("aria-expanded", "false");
        });

        console.log("CustomCombobox component loaded successfully.");
    }
}

customElements.define("custom-combobox", CustomCombobox);
