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
                    gap: 4px;
                    border-bottom: 2px solid #e5e7eb;
                }
                .tab-button {
                    flex: none;
                    padding: 8px 16px;
                    background: transparent;
                    border: none;
                    cursor: pointer;
                    font-weight: 500;
                    transition: all 0.2s;
                    color: #374151;
                    border-radius: 4px;
                    font-size: 14px;
                }
                .tab-button.active {
                    color: #111827;
                    background-color: #e5e7eb;
                    border-bottom: 2px solid #1e40af;
                }
                .tab-button:hover {
                    background-color: #f3f4f6;
                }
                .tab-content {
                    display: none;
                    padding: 16px;
                    background: white;
                    border-radius: 4px;
                }
                .tab-content.active {
                    display: block;
                }
            </style>
            <div class="tabs-container">
                ${this.tabs.map(tab => `
                    <button class="tab-button ${tab.id === this.activeTab ? 'active' : ''}" data-tab="${tab.id}">
                        ${tab.label}
                    </button>
                `).join("")}
            </div>
            <div class="tab-contents">
                ${this.tabs.map(tab => `
                    <div class="tab-content ${tab.id === this.activeTab ? 'active' : ''}" data-tab="${tab.id}">
                        ${tab.content}
                    </div>
                `).join("")}
            </div>
        `;
    }
}

customElements.define("custom-tabs", CustomTabs);
