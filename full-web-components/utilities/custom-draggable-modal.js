/**
 * Web Component: Custom Draggable Modal
 *
 * How to use in Webflow:
 * 1. Add an "Embed" element inside Webflow.
 * 2. Paste the following HTML:
 *      <custom-draggable-modal title="My Modal">
 *          <div slot="content">This is the modal content.</div>
 *      </custom-draggable-modal>
 * 3. Modify the "title" attribute to change the modal title.
 * 4. Add content inside the component using `<div slot="content">`.
 * 5. Open/close the modal using:
 *      document.querySelector('custom-draggable-modal').openModal();
 *      document.querySelector('custom-draggable-modal').closeModal();
 * 6. Listen for modal events using:
 *      document.querySelector('custom-draggable-modal').addEventListener('modal-toggle', (e) => {
 *          console.log('Modal open:', e.detail.open);
 *      });
 */

<script>
class CustomDraggableModal extends HTMLElement {
    static get observedAttributes() {
        return ["title"];
    }

    constructor() {
        super();
        this.attachShadow({ mode: "open" });

        this.modalWrapper = document.createElement("div");
        this.modalWrapper.classList.add("modal-wrapper");

        this.modal = document.createElement("div");
        this.modal.classList.add("modal");

        this.header = document.createElement("div");
        this.header.classList.add("modal-header");
        this.header.textContent = this.getAttribute("title") || "Modal Title";

        this.closeButton = document.createElement("button");
        this.closeButton.classList.add("close-button");
        this.closeButton.textContent = "×";
        this.closeButton.addEventListener("click", () => this.closeModal());

        this.contentSlot = document.createElement("slot");
        this.contentSlot.setAttribute("name", "content");

        this.modal.appendChild(this.header);
        this.modal.appendChild(this.closeButton);
        this.modal.appendChild(this.contentSlot);
        this.modalWrapper.appendChild(this.modal);

        this.modalWrapper.addEventListener("mousedown", (e) => this.startDrag(e));

        this.isDragging = false;
        this.offsetX = 0;
        this.offsetY = 0;

        const style = document.createElement("style");
        style.textContent = `
            .modal-wrapper {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                display: none;
                background: rgba(0, 0, 0, 0.5);
                align-items: center;
                justify-content: center;
                z-index: 1000;
            }
            .modal {
                background: white;
                padding: 20px;
                border-radius: var(--border-radius, 8px);
                width: 400px;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
                cursor: grab;
            }
            .modal-header {
                font-size: var(--font-size, 18px);
                font-weight: bold;
                margin-bottom: 10px;
            }
            .close-button {
                position: absolute;
                top: 10px;
                right: 10px;
                background: none;
                border: none;
                font-size: 18px;
                cursor: pointer;
            }
        `;

        this.shadowRoot.appendChild(style);
        this.shadowRoot.appendChild(this.modalWrapper);
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "title") {
            this.header.textContent = newValue;
        }
    }

    openModal() {
        this.modalWrapper.style.display = "flex";
        this.dispatchEvent(new CustomEvent("modal-toggle", {
            detail: { open: true },
            bubbles: true
        }));
    }

    closeModal() {
        this.modalWrapper.style.display = "none";
        this.dispatchEvent(new CustomEvent("modal-toggle", {
            detail: { open: false },
            bubbles: true
        }));
    }

    startDrag(e) {
        if (!e.target.classList.contains("modal")) return;
        this.isDragging = true;
        this.offsetX = e.clientX - this.modal.getBoundingClientRect().left;
        this.offsetY = e.clientY - this.modal.getBoundingClientRect().top;

        document.addEventListener("mousemove", this.drag.bind(this));
        document.addEventListener("mouseup", this.stopDrag.bind(this));
    }

    drag(e) {
        if (!this.isDragging) return;
        this.modal.style.left = `${e.clientX - this.offsetX}px`;
        this.modal.style.top = `${e.clientY - this.offsetY}px`;
    }

    stopDrag() {
        this.isDragging = false;
        document.removeEventListener("mousemove", this.drag.bind(this));
        document.removeEventListener("mouseup", this.stopDrag.bind(this));
    }
}

customElements.define("custom-draggable-modal", CustomDraggableModal);
</script>