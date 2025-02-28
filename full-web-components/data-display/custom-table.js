/**
 * Web Component: Custom Table
 *
 * How to use in Webflow:
 * 1. Add an "Embed" element inside Webflow.
 * 2. Paste the following HTML:
 *      <custom-table data='{
 *          "headers": ["Name", "Age", "Country"],
 *          "rows": [
 *              ["John Doe", "30", "USA"],
 *              ["Jane Smith", "25", "Canada"],
 *              ["Alice Johnson", "28", "UK"]
 *          ]
 *      }'></custom-table>
 * 3. Modify the "data" attribute to customize the table contents.
 * 4. Apply custom styling via Webflow or CSS variables.
 */


<script>
class CustomTable extends HTMLElement {
    static get observedAttributes() {
        return ["data"];
    }

    constructor() {
        super();
        this.attachShadow({ mode: "open" });

        this.table = document.createElement("table");
        this.table.classList.add("custom-table");

        this.updateTable();

        const style = document.createElement("style");
        style.textContent = `
            .custom-table {
                width: 100%;
                border-collapse: collapse;
                font-size: var(--font-size, 16px);
            }
            th, td {
                border: 1px solid var(--table-border, #ddd);
                padding: 8px;
                text-align: left;
            }
            th {
                background: var(--table-header-bg, #f4f4f4);
                font-weight: bold;
            }
        `;

        this.shadowRoot.appendChild(style);
        this.shadowRoot.appendChild(this.table);
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "data") {
            this.updateTable();
        }
    }

    updateTable() {
        const data = JSON.parse(this.getAttribute("data") || '{"headers":[], "rows":[]}');
        this.table.innerHTML = "";

        if (data.headers.length) {
            const thead = document.createElement("thead");
            const headerRow = document.createElement("tr");
            data.headers.forEach(header => {
                const th = document.createElement("th");
                th.textContent = header;
                headerRow.appendChild(th);
            });
            thead.appendChild(headerRow);
            this.table.appendChild(thead);
        }

        if (data.rows.length) {
            const tbody = document.createElement("tbody");
            data.rows.forEach(rowData => {
                const tr = document.createElement("tr");
                rowData.forEach(cellData => {
                    const td = document.createElement("td");
                    td.textContent = cellData;
                    tr.appendChild(td);
                });
                tbody.appendChild(tr);
            });
            this.table.appendChild(tbody);
        }
    }
}

customElements.define("custom-table", CustomTable);
</script>