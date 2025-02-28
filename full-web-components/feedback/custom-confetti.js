/**
 * Web Component: Custom Confetti
 *
 * How to use in Webflow:
 * 1. Add an "Embed" element inside Webflow.
 * 2. Paste the following HTML:
 *      <custom-confetti></custom-confetti>
 * 3. Trigger confetti using:
 *      document.querySelector('custom-confetti').launchConfetti();
 * 4. Modify the "count" attribute to change the number of confetti particles.
 */

<script>
class CustomConfetti extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });

        this.canvas = document.createElement("canvas");
        this.shadowRoot.appendChild(this.canvas);

        this.ctx = this.canvas.getContext("2d");
        this.confettiParticles = [];
        this.isRunning = false;

        const style = document.createElement("style");
        style.textContent = `
            canvas {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                pointer-events: none;
            }
        `;

        this.shadowRoot.appendChild(style);
        this.resizeCanvas();
        window.addEventListener("resize", () => this.resizeCanvas());
    }

    launchConfetti() {
        this.confettiParticles = [];
        const count = parseInt(this.getAttribute("count")) || 100;
        for (let i = 0; i < count; i++) {
            this.confettiParticles.push(this.createConfetti());
        }
        if (!this.isRunning) {
            this.isRunning = true;
            this.animateConfetti();
        }
    }

    createConfetti() {
        const colors = ["#FF0A54", "#FF477E", "#FF7096", "#FF85A1", "#FFA3B2"];
        return {
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height - this.canvas.height,
            size: Math.random() * 6 + 4,
            speedX: Math.random() * 2 - 1,
            speedY: Math.random() * 3 + 2,
            color: colors[Math.floor(Math.random() * colors.length)],
            rotation: Math.random() * 360
        };
    }

    animateConfetti() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.confettiParticles.forEach((confetti, index) => {
            confetti.y += confetti.speedY;
            confetti.x += confetti.speedX;
            confetti.rotation += 2;

            this.ctx.fillStyle = confetti.color;
            this.ctx.beginPath();
            this.ctx.arc(confetti.x, confetti.y, confetti.size, 0, Math.PI * 2);
            this.ctx.fill();

            if (confetti.y > this.canvas.height) {
                this.confettiParticles.splice(index, 1);
            }
        });

        if (this.confettiParticles.length > 0) {
            requestAnimationFrame(() => this.animateConfetti());
        } else {
            this.isRunning = false;
        }
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
}

customElements.define("custom-confetti", CustomConfetti);
</script>