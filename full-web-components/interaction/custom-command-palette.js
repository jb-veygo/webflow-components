/**
 * Web Component: Custom Command Palette
 *
 * How to use in Webflow:
 * 1. Add an "Embed" element inside Webflow.
 * 2. Paste the following HTML:
 *      <custom-command-palette commands='[
 *          {"label": "Open Dashboard", "action": "dashboard"},
 *          {"label": "Settings", "action": "settings"},
 *          {"label": "Logout", "action": "logout"}
 *      ]'></custom-command-palette>
 * 3. Modify the "commands" attribute to customize available commands.
 * 4. Open the command palette using "Ctrl + K" or call:
 *      document.querySelector('custom-command-palette').openPalette();
 * 5. Listen for command selection using:
 *      document.querySelector('custom-command-palette').addEventListener('command-selected', (e) => {
 *          console.log('Selected command:', e.detail.command);
 *      });
 */

<script>
class CustomCommandPalette extends HTMLElement {
    static get observedAttributes() {
        return ["commands"];
    }

    constructor() {
        super();
        this.attachShadow({ mode: "open" });

        this.wrapper = document.createElement("div");
        this.wrapper.classList.add("palette-wrapper");

        this.input = document.createElement("input");
        this.input.setAttribute("type", "text");
        this.input.setAttribute("placeholder", "Type a command...");
        this.input.classList.add("palette-input");
        this.input.addEventListener("input", () => this.filterCommands());
        this.input.addEventListener("keydown", (e) => this.handleKeydown(e));

        this.commandsList = document.createElement("div");
        this.commandsList.classList.add("commands-list");

        this.wrapper.appendChild(this.input);
        this.wrapper.appendChild(this.commandsList);

        this.commands = JSON.parse(this.getAttribute("commands") || "[]");
        this.filteredCommands = [...this.commands];
        this.renderCommands();

        this.isOpen = false;
        this.initKeyboardShortcut();

        const style = document.createElement("style");
        style.textContent = `
            .palette-wrapper {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: var(--palette-bg, white);
                border: 1px solid var(--input-border, #ccc);
                border-radius: var(--border-radius, 6px);
                box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
                width: 300px;
                padding: 10px;
                display: none;
                z-index: 1000;
            }
            .palette-input {
                width: 100%;
                padding: 8px;
                border: none;
                border-bottom: 1px solid var(--input-border, #ccc);
                outline: none;
                font-size: var(--font-size, 16px);
            }
            .commands-list {
                margin-top: 8px;
                max-height: 200px;
                overflow-y: auto;
            }
            .command {
                padding: 8px;
                cursor: pointer;
                border-radius: 4px;
            }
            .command:hover, .command.selected {
                background: var(--primary-hover, #e2e6ea);
            }
        `;

        this.shadowRoot.appendChild(style);
        this.shadowRoot.appendChild(this.wrapper);
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "commands") {
            this.commands = JSON.parse(newValue || "[]");
            this.filteredCommands = [...this.commands];
            this.renderCommands();
        }
    }

    renderCommands() {
        this.commandsList.innerHTML = "";
        this.filteredCommands.forEach((command, index) => {
            const commandElement = document.createElement("div");
            commandElement.classList.add("command");
            commandElement.textContent = command.label;
            commandElement.setAttribute("data-action", command.action);
            commandElement.addEventListener("click", () => this.selectCommand(command));
            if (index === 0) commandElement.classList.add("selected");
            this.commandsList.appendChild(commandElement);
        });
    }

    filterCommands() {
        const search = this.input.value.toLowerCase();
        this.filteredCommands = this.commands.filter(cmd => cmd.label.toLowerCase().includes(search));
        this.renderCommands();
    }

    selectCommand(command) {
        this.dispatchEvent(new CustomEvent("command-selected", {
            detail: { command },
            bubbles: true
        }));
        this.closePalette();
    }

    handleKeydown(event) {
        const items = this.commandsList.querySelectorAll(".command");
        const selected = this.commandsList.querySelector(".selected");
        let index = Array.from(items).indexOf(selected);

        if (event.key === "ArrowDown") {
            event.preventDefault();
            index = (index + 1) % items.length;
        } else if (event.key === "ArrowUp") {
            event.preventDefault();
            index = (index - 1 + items.length) % items.length;
        } else if (event.key === "Enter" && selected) {
            this.selectCommand(this.filteredCommands[index]);
            return;
        }

        items.forEach(item => item.classList.remove("selected"));
        if (items[index]) items[index].classList.add("selected");
    }

    openPalette() {
        this.wrapper.style.display = "block";
        this.input.focus();
        this.isOpen = true;
    }

    closePalette() {
        this.wrapper.style.display = "none";
        this.isOpen = false;
    }

    initKeyboardShortcut() {
        document.addEventListener("keydown", (event) => {
            if (event.ctrlKey && event.key === "k") {
                event.preventDefault();
                this.isOpen ? this.closePalette() : this.openPalette();
            }
        });
    }
}

customElements.define("custom-command-palette", CustomCommandPalette);
</script>