<script>
class CustomTabs extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });

        this.wrapper = document.createElement("div");
        this.wrapper.classList.add("tabs-wrapper");

        this.tabList = document.createElement("div");
        this.tabList.classList.add("tab-list");

        this.contentSlot = document.createElement("slot");
        this.contentSlot.setAttribute("name", "tab-content");

        this.contentWrapper = document.createElement("div");
        this.contentWrapper.classList.add("tab-content");
        this.contentWrapper.appendChild(this.contentSlot);

        this.wrapper.appendChild(this.tabList);
        this.wrapper.appendChild(this.contentWrapper);

        this.shadowRoot.appendChild(this.wrapper);

        this.initTabs();

        const style = document.createElement("style");
        style.textContent = `
            .tabs-wrapper {
                display: flex;
                flex-direction: column;
                width: 100%;
            }
            .tab-list {
                display: flex;
                border-bottom: 2px solid var(--tab-border, #ccc);
            }
            .tab {
                padding: 10px 16px;
                cursor: pointer;
                font-size: var(--font-size, 16px);
                font-weight: bold;
                border-bottom: 2px solid transparent;
                transition: all 0.2s;
            }
            .tab.active {
                color: var(--primary-color, #0073e6);
                border-bottom: 2px solid var(--primary-color, #0073e6);
            }
            .tab-content {
                padding: 16px;
                background: var(--tab-content-bg, white);
            }
            .tab-panel {
                display: none;
            }
            .tab-panel.active {
                display: block;
            }
        `;

        this.shadowRoot.appendChild(style);
    }

    initTabs() {
        this.tabs = [];
        this.panels = [];

        const slot = this.shadowRoot.querySelector("slot");
        slot.addEventListener("slotchange", () => {
            this.tabs = [];
            this.panels = [];

            const assignedNodes = slot.assignedNodes();
            assignedNodes.forEach((node, index) => {
                if (node.nodeType === Node.ELEMENT_NODE && node.getAttribute("data-tab")) {
                    const tabName = node.getAttribute("data-tab");

                    const tab = document.createElement("div");
                    tab.classList.add("tab");
                    tab.textContent = tabName;
                    tab.addEventListener("click", () => this.activateTab(index));

                    this.tabList.appendChild(tab);
                    this.tabs.push(tab);
                    this.panels.push(node);
                }
            });

            if (this.tabs.length > 0) {
                this.activateTab(0);
            }
        });
    }

    activateTab(index) {
        this.tabs.forEach(tab => tab.classList.remove("active"));
        this.panels.forEach(panel => panel.classList.remove("active"));

        this.tabs[index].classList.add("active");
        this.panels[index].classList.add("active");
    }
}

customElements.define("custom-tabs", CustomTabs);
</script>