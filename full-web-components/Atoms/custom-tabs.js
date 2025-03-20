class CustomTabs extends HTMLElement {
    static get observedAttributes() {
        return ["tabs", "active"];
    }

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        try {
            this.tabs = JSON.parse(this.getAttribute("tabs") || "[]");
        } catch (e) {
            console.error("Error parsing tabs attribute: ", e);
            this.tabs = [];
        }
        if (!Array.isArray(this.tabs) || this.tabs.length === 0) {
            console.warn("No valid tabs provided. Ensure the 'tabs' attribute is a JSON-encoded array.");
            return;
        }
        this.activeTab = this.getAttribute("active") || (this.tabs.length > 0 ? this.tabs[0].id : "");
        this.render();
    }

    connectedCallback() {
        this.shadowRoot.querySelectorAll(".tab-button").forEach(button => {
            button.addEventListener("click", (event) => this.selectTab(event.target.dataset.tab));
        });
    }

    selectTab(tabId) {
        this.activeTab = tabId;
        this.shadowRoot.querySelectorAll(".tab-button").forEach(button => {
            button.classList.toggle("active", button.dataset.tab === tabId);
        });
        this.shadowRoot.querySelectorAll(".tab-content").forEach(content => {
            content.style.display = content.dataset.tab === tabId ? "block" : "none";
        });
        this.dispatchEvent(new CustomEvent("tab-change", { detail: tabId, bubbles: true, composed: true }));
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                .tabs-container {
                    display: flex;
                    gap: 8px;
                    background-color: #f3f3f3;
                    padding: 4px;
                    border-radius: 8px;
                }
                .tab-button {
                    flex: none;
                    padding: 10px 16px;
                    background: transparent;
                    border: none;
                    cursor: pointer;
                    font-weight: 500;
                    font-size: 14px;
                    border-radius: 6px;
                    color: #1c1c1c;
                    transition: background-color 0.2s ease, color 0.2s ease;
                }
                .tab-button.active {
                    background-color: white;
                    color: black;
                    font-weight: bold;
                }
                .tab-button:hover {
                    background-color: rgba(0, 0, 0, 0.1);
                }
                .tab-content {
                    display: none;
                    padding: 16px;
                    background: white;
                    border-radius: 6px;
                    color: black;
                }
                .tab-content.active {
                    display: block;
                }
            </style>
            <div class="tabs-container">
                ${this.tabs.map(tab => `
                    <button class="tab-button ${tab.id === this.activeTab ? 'active' : ''}" data-tab="${tab.id}" role="tab" aria-selected="${tab.id === this.activeTab}">
                        ${tab.label}
                    </button>
                `).join("")}
            </div>
            <div class="tab-contents">
                ${this.tabs.map(tab => `
                    <div class="tab-content ${tab.id === this.activeTab ? 'active' : ''}" data-tab="${tab.id}" role="tabpanel" aria-hidden="${tab.id !== this.activeTab}">
                        ${tab.content || ""}
                    </div>
                `).join("")}
            </div>
        `;
    }
}

customElements.define("custom-tabs", CustomTabs);
