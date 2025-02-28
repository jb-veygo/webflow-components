/**
 * Web Component: Custom Chart
 *
 * How to use in Webflow:
 * 1. Add an "Embed" element inside Webflow.
 * 2. Paste the following HTML:
 *      <custom-charts type="bar" data='{"labels":["Jan","Feb","Mar"],"datasets":[{"label":"Sales","data":[10,20,30]}]}'></custom-charts>
 * 3. Modify the "type" attribute to change the chart type (options: bar, line, pie, doughnut).
 * 4. Modify the "data" attribute with a JSON object following Chart.js format.
 */

<script>
class CustomCharts extends HTMLElement {
    static get observedAttributes() {
        return ["type", "data"];
    }

    constructor() {
        super();
        this.attachShadow({ mode: "open" });

        this.canvas = document.createElement("canvas");
        this.canvas.id = "chartCanvas";

        this.shadowRoot.appendChild(this.canvas);
        this.chart = null;

        this.loadChartLibrary();
    }

    async loadChartLibrary() {
        if (!window.Chart) {
            const script = document.createElement("script");
            script.src = "https://cdn.jsdelivr.net/npm/chart.js";
            script.onload = () => this.renderChart();
            document.head.appendChild(script);
        } else {
            this.renderChart();
        }
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (this.chart) {
            this.chart.destroy();
        }
        this.renderChart();
    }

    renderChart() {
        if (!window.Chart) return;

        const ctx = this.canvas.getContext("2d");
        const type = this.getAttribute("type") || "bar";
        const data = JSON.parse(this.getAttribute("data") || "{}");

        this.chart = new Chart(ctx, {
            type: type,
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
            }
        });
    }
}

customElements.define("custom-charts", CustomCharts);
</script>