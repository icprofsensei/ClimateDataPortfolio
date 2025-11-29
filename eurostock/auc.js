function drawauc(element, series, title) {
    anychart.onDocumentReady(function () {
        try {
            const chart = anychart.line();
            const cols = ['#121bd5', '#d51212', '#12d519', '#eff638', '#38f6ee']
            series['Random Classifier'] = 0.5
            Object.keys(series).forEach((seriesName, index) => {
                const aucValue = series[seriesName];
                const points = [];
                
                
                for (let i = 0; i <= 1; i += 0.01) {
                    const tpr = calculateTPR(i, aucValue);
                    points.push({ x: i, y: tpr });
                }
                
                const linegraph = chart.line(points);
                linegraph.name(`${seriesName} (AUC = ${aucValue.toFixed(3)})`);
                linegraph.stroke({ thickness: 3, color: cols[index]});
                if (aucValue == 0.5) {
                    linegraph.stroke({ thickness: 2, dash: '5 5', color: '#999999'});
                }
            });
            chart.legend().enabled(true);
            chart.legend().fontSize(12);
            chart.title(title);
            chart.title().fontSize(16);
            chart.xAxis().title('False Positive Rate');
            chart.yAxis().title('True Positive Rate');
            chart.xAxis().labels().format(function () {
                return this.value.toFixed(2);
            });
            chart.yAxis().labels().format(function () {
                return this.value.toFixed(2);
            });
            
            
            chart.container(element);
            chart.draw();
            
        } catch (error) {
            console.error("Error initializing the chart:", error);
        }
    });
}

// Helper function for better TPR calculation
function calculateTPR(fpr, aucValue) {
    if (aucValue === 0.5) return fpr; // x=y
    if (aucValue > 0.5) {
        const k = (aucValue - 0.5) * 4; 
        return Math.pow(fpr, Math.exp(-k));
    }
    return 1 - Math.pow(1 - fpr, Math.exp((0.5 - aucValue) * 4));
}