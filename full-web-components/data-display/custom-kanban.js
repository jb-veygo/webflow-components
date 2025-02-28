/**
 * Web Component: Custom Kanban Board
 *
 * How to use in Webflow:
 * 1. Add an "Embed" element inside Webflow.
 * 2. Paste the following HTML:
 *      <custom-kanban data='[
 *          {"title": "To Do", "tasks": ["Task 1", "Task 2"]},
 *          {"title": "In Progress", "tasks": ["Task 3"]},
 *          {"title": "Done", "tasks": ["Task 4", "Task 5"]}
 *      ]'></custom-kanban>
 * 3. Modify the "data" attribute with an array of columns and tasks.
 * 4. Drag and drop tasks between columns.
 * 5. Listen for task updates using:
 *      document.querySelector('custom-kanban').addEventListener('task-updated', (e) => {
 *          console.log('Updated Kanban data:', e.detail.data);
 *      });
 */

<script>
class CustomKanban extends HTMLElement {
    static get observedAttributes() {
        return ["data"];
    }

    constructor() {
        super();
        this.attachShadow({ mode: "open" });

        this.wrapper = document.createElement("div");
        this.wrapper.classList.add("kanban-board");

        this.data = JSON.parse(this.getAttribute("data") || "[]");
        this.renderBoard();

        const style = document.createElement("style");
        style.textContent = `
            .kanban-board {
                display: flex;
                gap: 16px;
                overflow-x: auto;
                padding: 10px;
            }
            .kanban-column {
                background: var(--column-bg, #f8f9fa);
                padding: 10px;
                border-radius: var(--border-radius, 6px);
                min-width: 250px;
                flex: 1;
            }
            .kanban-column h3 {
                text-align: center;
                font-size: var(--font-size, 18px);
                margin-bottom: 10px;
            }
            .kanban-tasks {
                min-height: 50px;
                padding: 8px;
                background: white;
                border-radius: var(--border-radius, 6px);
            }
            .kanban-task {
                background: var(--primary-color, #0073e6);
                color: white;
                padding: 8px;
                margin-bottom: 8px;
                border-radius: 6px;
                cursor: grab;
            }
        `;

        this.shadowRoot.appendChild(style);
        this.shadowRoot.appendChild(this.wrapper);
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "data") {
            this.data = JSON.parse(newValue || "[]");
            this.renderBoard();
        }
    }

    renderBoard() {
        this.wrapper.innerHTML = "";
        this.data.forEach(column => {
            const columnEl = document.createElement("div");
            columnEl.classList.add("kanban-column");

            const titleEl = document.createElement("h3");
            titleEl.textContent = column.title;

            const taskList = document.createElement("div");
            taskList.classList.add("kanban-tasks");
            taskList.setAttribute("draggable", "true");
            taskList.addEventListener("dragover", (e) => e.preventDefault());
            taskList.addEventListener("drop", (e) => this.handleDrop(e, column.title));

            column.tasks.forEach(task => {
                const taskEl = document.createElement("div");
                taskEl.classList.add("kanban-task");
                taskEl.textContent = task;
                taskEl.setAttribute("draggable", "true");
                taskEl.addEventListener("dragstart", (e) => this.handleDragStart(e, task, column.title));
                taskList.appendChild(taskEl);
            });

            columnEl.appendChild(titleEl);
            columnEl.appendChild(taskList);
            this.wrapper.appendChild(columnEl);
        });
    }

    handleDragStart(event, task, fromColumn) {
        event.dataTransfer.setData("task", task);
        event.dataTransfer.setData("fromColumn", fromColumn);
    }

    handleDrop(event, toColumn) {
        const task = event.dataTransfer.getData("task");
        const fromColumn = event.dataTransfer.getData("fromColumn");

        if (fromColumn !== toColumn) {
            this.data = this.data.map(column => {
                if (column.title === fromColumn) {
                    column.tasks = column.tasks.filter(t => t !== task);
                }
                if (column.title === toColumn) {
                    column.tasks.push(task);
                }
                return column;
            });

            this.setAttribute("data", JSON.stringify(this.data));
            this.dispatchEvent(new CustomEvent("task-updated", {
                detail: { data: this.data },
                bubbles: true
            }));
        }
    }
}

customElements.define("custom-kanban", CustomKanban);
</script>