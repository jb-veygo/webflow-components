class CustomCommand extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = '';

        // Command Wrapper
        this.commandWrapper = document.createElement("div");
        this.commandWrapper.classList.add("command-wrapper");

        // Command Input Field
        this.commandInput = document.createElement("input");
        this.commandInput.classList.add("command-input");
        this.commandInput.setAttribute("placeholder", "Type a command...");
        this.commandInput.setAttribute("aria-label", "Command input");

        // Command List
        this.commandList = document.createElement("ul");
        this.commandList.classList.add("command-list");
        this.commandList.setAttribute("role", "listbox");
        this.commandList.innerHTML = `<slot></slot>`;

        // Append elements
        this.commandWrapper.appendChild(this.commandInput);
        this.commandWrapper.appendChild(this.commandList);
        this.shadowRoot.appendChild(this.commandWrapper);

        // Styles
        const style = document.createElement("style");
        style.textContent = `
            .command-wrapper {
                display: flex;
                flex-direction: column;
                border: 1px solid #e5e7eb;
                border-radius: 0.5rem;
                background: white;
                padding: 0.5rem;
                box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
                max-width: 300px;
            }
            
            .command-input {
                width: 100%;
                padding: 0.5rem;
                font-size: 0.875rem;
                border-radius: 0.375rem;
                border: 1px solid #e5e7eb;
                outline: none;
                transition: border-color 0.2s ease-in-out;
            }
            
            .command-input:focus {
                border-color: #1e40af;
                box-shadow: 0 0 0 2px rgba(30, 64, 175, 0.2);
            }
            
            .command-list {
                list-style: none;
                margin: 0;
                padding: 0;
                max-height: 200px;
                overflow-y: auto;
                display: none;
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
        this.commandInput.addEventListener("focus", () => {
            this.commandList.classList.add("active");
        });

        this.commandInput.addEventListener("blur", () => {
            setTimeout(() => this.commandList.classList.remove("active"), 200);
        });
    }
}

customElements.define("custom-command", CustomCommand);
