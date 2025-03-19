class CustomTabs extends HTMLElement {
    static get observedAttributes() {
        return ["tabs", "active"];
    }

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.tabs = JSON.parse(this.getAttribute("tabs") || "[]");
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
                    border-bottom: 2px solid #e5e7eb;
                }
                .tab-button {
                    flex: 1;
                    padding: 10px 16px;
                    background: transparent;
                    border: none;
                    cursor: pointer;
                    font-weight: 500;
                    transition: color 0.2s;
                }
                .tab-button.active {
                    color: #1e40af;
                    border-bottom: 2px solid #1e40af;
                }
                .tab-content {
                    display: none;
                    padding: 16px;
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
                    <div class="tab-content" data-tab="${tab.id}" style="display: ${tab.id === this.activeTab ? 'block' : 'none'}">
                        ${tab.content}
                    </div>
                `).join("")}
            </div>
        `;
    }
}

customElements.define("custom-tabs", CustomTabs);
