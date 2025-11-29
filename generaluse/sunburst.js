
    
function drawsunburst (html, title, data, coldict){
    function findColor(name) {
        if (coldict[name]) {
            return coldict[name];
        }
        else{
            return '#969595ff'
        }
        
    }

    var chart = anychart.sunburst(data, "as-true")
    chart.title(title);
    chart.title().fontSize(20);
    chart.legend().enabled(true);
    chart.calculationMode("parent-independent");
        chart.labels()
        .format(function() {
            // Get the current segment value
            var value = this.getData('value');
            
            // Calculate font size based on value (adjust multipliers as needed)
            var baseSize = 8;
            var sizeMultiplier = 0.5;
            var fontSize = Math.max(baseSize, Math.min(20, value * sizeMultiplier));
            return this.name;
        })
        .fontSize(function() {
            var value = this.getData('value');
            var total = this.getRootNode().getData('value');
            var percentage = value / total * 100;
            
            // Scale font size based on percentage
            var minSize = 8;
            var maxSize = 24;
            var fontSize = minSize + (percentage / 100) * (maxSize - minSize);
            
            return Math.max(minSize, Math.min(maxSize, fontSize));
    
    });
    
    chart.tooltip()
        .titleFormat("{%name}")
        .format(function() {
            var value = this.name;
            return value;
        });
   chart.fill(function() {
        var name = this.point.node.la['name'];
        var color = findColor(name);
        
        if (color) {
            return color;
        } else {
            console.warn("No color mapping for:", name);
            return this.sourceColor;
        }
    });
    chart.container(html);
    chart.draw();
}
