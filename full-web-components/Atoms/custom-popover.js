class CustomPopover extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = '';
        
        // Popover Wrapper
        this.popoverWrapper = document.createElement("div");
        this.popoverWrapper.classList.add("popover-wrapper");

        // Popover Trigger Button
        this.triggerButton = document.createElement("button");
        this.triggerButton.classList.add("popover-trigger");
        this.triggerButton.innerHTML = `<slot name="trigger">Open</slot>`;
        this.triggerButton.setAttribute("aria-haspopup", "true");
        this.triggerButton.setAttribute("aria-expanded", "false");

        // Popover Content
        this.popoverContent = document.createElement("div");
        this.popoverContent.classList.add("popover-content");
        this.popoverContent.setAttribute("role", "dialog");
        this.popoverContent.setAttribute("aria-hidden", "true");
        this.popoverContent.innerHTML = `<slot></slot>`;

        // Append elements
        this.popoverWrapper.appendChild(this.triggerButton);
        this.popoverWrapper.appendChild(this.popoverContent);
        this.shadowRoot.appendChild(this.popoverWrapper);

        // Styles
        const style = document.createElement("style");
        style.textContent = `
            .popover-wrapper {
                position: relative;
                display: inline-block;
            }
            
            .popover-trigger {
                background-color: #1e40af;
                color: white;
                padding: 0.5rem 1rem;
                border-radius: 0.375rem;
                border: none;
                cursor: pointer;
                font-size: 0.875rem;
            }
            
            .popover-trigger:hover {
                background-color: #1e3a8a;
            }
            
            .popover-content {
                position: absolute;
                top: 100%;
                left: 50%;
                transform: translateX(-50%);
                background-color: white;
                padding: 1rem;
                border-radius: 0.5rem;
                box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
                min-width: 200px;
                display: none;
                z-index: 10;
            }
            
            .popover-content.active {
                display: block;
            }
        `;
        
        this.shadowRoot.appendChild(style);

        // Event Listeners
        this.triggerButton.addEventListener("click", () => {
            const isOpen = this.popoverContent.classList.contains("active");
            this.popoverContent.classList.toggle("active");
            this.triggerButton.setAttribute("aria-expanded", !isOpen);
            this.popoverContent.setAttribute("aria-hidden", isOpen);
        });
    }
}

customElements.define("custom-popover", CustomPopover);
