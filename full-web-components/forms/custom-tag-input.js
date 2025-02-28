/**
 * Web Component: Custom Tag Input
 *
 * How to use in Webflow:
 * 1. Add an "Embed" element inside Webflow.
 * 2. Paste the following HTML:
 *      <custom-tag-input placeholder="Add a tag..."></custom-tag-input>
 * 3. Modify the "placeholder" attribute to change the input hint text.
 * 4. Listen for tag changes using:
 *      document.querySelector('custom-tag-input').addEventListener('tags-change', (e) => {
 *          console.log('Current tags:', e.detail.tags);
 *      });
 */

<script>
class CustomTagInput extends HTMLElement {
    static get observedAttributes() {
        return ["placeholder"];
    }

    constructor() {
        super();
        this.attachShadow({ mode: "open" });

        this.wrapper = document.createElement("div");
        this.wrapper.classList.add("tag-input-wrapper");

        this.input = document.createElement("input");
        this.input.setAttribute("type", "text");
        this.input.setAttribute("placeholder", this.getAttribute("placeholder") || "Add a tag...");
        this.input.classList.add("tag-input");

        this.tagsContainer = document.createElement("div");
        this.tagsContainer.classList.add("tags-container");

        this.tags = [];

        this.input.addEventListener("keydown", (e) => this.handleInput(e));
        this.tagsContainer.addEventListener("click", (e) => this.handleTagRemove(e));

        const style = document.createElement("style");
        style.textContent = `
            .tag-input-wrapper {
                display: flex;
                flex-direction: column;
                border: 1px solid var(--input-border, #ccc);
                border-radius: var(--border-radius, 6px);
                padding: 8px;
                font-size: var(--font-size, 16px);
                width: 100%;
                max-width: 100%;
            }
            .tags-container {
                display: flex;
                flex-wrap: wrap;
                gap: 6px;
                margin-bottom: 6px;
            }
            .tag {
                background: var(--primary-color, #0073e6);
                color: white;
                padding: 4px 8px;
                border-radius: 4px;
                display: flex;
                align-items: center;
                gap: 4px;
                cursor: pointer;
            }
            .tag span {
                font-weight: bold;
            }
            .tag-remove {
                background: none;
                border: none;
                color: white;
                font-size: 14px;
                cursor: pointer;
            }
            .tag-input {
                width: 100%;
                border: none;
                outline: none;
                font-size: var(--font-size, 16px);
            }
        `;

        this.shadowRoot.appendChild(style);
        this.shadowRoot.appendChild(this.wrapper);
        this.wrapper.appendChild(this.tagsContainer);
        this.wrapper.appendChild(this.input);
    }

    handleInput(e) {
        if (e.key === "Enter" && this.input.value.trim() !== "") {
            this.addTag(this.input.value.trim());
            this.input.value = "";
        }
    }

    handleTagRemove(e) {
        if (e.target.classList.contains("tag-remove")) {
            const tagText = e.target.parentElement.querySelector("span").textContent;
            this.removeTag(tagText);
        }
    }

    addTag(tag) {
        if (!this.tags.includes(tag)) {
            this.tags.push(tag);
            this.renderTags();
            this.emitTagsChange();
        }
    }

    removeTag(tag) {
        this.tags = this.tags.filter(t => t !== tag);
        this.renderTags();
        this.emitTagsChange();
    }

    renderTags() {
        this.tagsContainer.innerHTML = "";
        this.tags.forEach(tag => {
            const tagElement = document.createElement("div");
            tagElement.classList.add("tag");

            const tagText = document.createElement("span");
            tagText.textContent = tag;

            const removeButton = document.createElement("button");
            removeButton.classList.add("tag-remove");
            removeButton.textContent = "×";

            tagElement.appendChild(tagText);
            tagElement.appendChild(removeButton);
            this.tagsContainer.appendChild(tagElement);
        });
    }

    emitTagsChange() {
        this.dispatchEvent(new CustomEvent("tags-change", {
            detail: { tags: this.tags },
            bubbles: true
        }));
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "placeholder") {
            this.input.setAttribute("placeholder", newValue);
        }
    }
}

customElements.define("custom-tag-input", CustomTagInput);
</script>