/**
 * Web Component: Custom Rich Text Editor
 *
 * How to use in Webflow:
 * 1. Add an "Embed" element inside Webflow.
 * 2. Paste the following HTML:
 *      <custom-rich-text-editor></custom-rich-text-editor>
 * 3. Listen for text changes using:
 *      document.querySelector('custom-rich-text-editor').addEventListener('text-change', (e) => {
 *          console.log('Editor content:', e.detail.content);
 *      });
 */

<script>
class CustomRichTextEditor extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });

        this.wrapper = document.createElement("div");
        this.wrapper.classList.add("editor-wrapper");

        this.toolbar = document.createElement("div");
        this.toolbar.classList.add("editor-toolbar");

        this.contentArea = document.createElement("div");
        this.contentArea.classList.add("editor-content");
        this.contentArea.setAttribute("contenteditable", "true");
        this.contentArea.addEventListener("input", () => this.handleTextChange());

        this.createToolbarButtons();

        const style = document.createElement("style");
        style.textContent = `
            .editor-wrapper {
                border: 1px solid var(--input-border, #ccc);
                border-radius: var(--border-radius, 6px);
                display: flex;
                flex-direction: column;
                width: 100%;
                max-width: 100%;
                font-size: var(--font-size, 16px);
            }
            .editor-toolbar {
                display: flex;
                gap: 6px;
                padding: 6px;
                background: var(--toolbar-bg, #f8f9fa);
                border-bottom: 1px solid var(--input-border, #ccc);
            }
            .editor-toolbar button {
                background: none;
                border: none;
                cursor: pointer;
                padding: 6px;
                font-size: 16px;
            }
            .editor-content {
                min-height: 150px;
                padding: 10px;
                outline: none;
                overflow: auto;
            }
        `;

        this.shadowRoot.appendChild(style);
        this.shadowRoot.appendChild(this.wrapper);
        this.wrapper.appendChild(this.toolbar);
        this.wrapper.appendChild(this.contentArea);
    }

    createToolbarButtons() {
        const buttons = [
            { label: "B", command: "bold" },
            { label: "I", command: "italic" },
            { label: "U", command: "underline" },
            { label: "H1", command: "formatBlock", value: "H1" },
            { label: "H2", command: "formatBlock", value: "H2" },
            { label: "P", command: "formatBlock", value: "P" }
        ];

        buttons.forEach(({ label, command, value }) => {
            const button = document.createElement("button");
            button.textContent = label;
            button.addEventListener("click", () => {
                document.execCommand(command, false, value || null);
                this.handleTextChange();
            });
            this.toolbar.appendChild(button);
        });
    }

    handleTextChange() {
        this.dispatchEvent(new CustomEvent("text-change", {
            detail: { content: this.contentArea.innerHTML },
            bubbles: true
        }));
    }
}

customElements.define("custom-rich-text-editor", CustomRichTextEditor);
</script>