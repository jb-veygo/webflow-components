class CustomTabs extends HTMLElement {
    static get observedAttributes() {
        return ["tabs", "active"];
    }

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        const tabsAttr = this.getAttribute("tabs") || "[]";
        let parsedTabs;

        // Check if the attribute is a JSON array of strings or an array of objects
        try {
            parsedTabs = JSON.parse(tabsAttr);
        } catch (e) {
            console.error("Error parsing tabs attribute:", e);
            parsedTabs = [];
        }

        // Normalize the tabs into the object format { id, label }
        this.tabs = Array.isArray(parsedTabs) ? parsedTabs.map(tab => {
            if (typeof tab === "string") {
                return { id: tab, label: tab.charAt(0).toUpperCase() + tab.slice(1) }; // Default label from id
            }
            return tab;
        }) : [];

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
        this.dispatchEvent(new CustomEvent("tab-change", { detail: tabId, bubbles: true, composed: true }));
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                .tabs-container {
                    display: flex;
                    background: #f3f3f3;
                    padding: 4px;
                    border-radius: 8px;
                    gap: 4px;
                }
                .tab-button {
                    flex: 1;
                    padding: 10px 16px;
                    background: transparent;
                    border: none;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: 500;
                    color: #1c1c1c;
                    border-radius: 6px;
                    transition: background-color 0.2s ease, color 0.2s ease;
                }
                .tab-button.active {
                    background: white;
                    color: black;
                    font-weight: bold;
                }
                .tab-button:hover {
                    background-color: rgba(0, 0, 0, 0.1);
                }
            </style>
            <div class="tabs-container">
                ${this.tabs.map(tab => `
                    <button class="tab-button ${tab.id === this.activeTab ? 'active' : ''}" data-tab="${tab.id}" role="tab" aria-selected="${tab.id === this.activeTab}">
                        ${tab.label}
                    </button>
                `).join("")}
            </div>
        `;
    }
}

customElements.define("custom-tabs", CustomTabs);
