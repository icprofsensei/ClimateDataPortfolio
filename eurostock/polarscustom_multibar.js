function YearAnimation() {
    const parentele = document.getElementById('starter');
    if (window.animationInterval) {
        clearInterval(window.animationInterval);
    }
    
    // Remove existing chart if present
    const existingChart = document.getElementById('multibar');
    if (existingChart) {
        existingChart.remove();
    }
    const div = document.createElement("div");
    div.id = 'multibar';
    div.style.height = '500px';
    div.style.border = '0.1px solid #ccc';
    parentele.appendChild(div);
    
    let counter = 0;
    window.animationInterval = setInterval(function() {
        counter++;
        customgrpedbarfromcsv(
            "eurostock/data/grped_histo.csv", 
            'multibar',
            "Comparison of days over 35 degrees 2015-2025 (May - September Ordinal Days)", 
            "Day",
            'Number of sites where Maximum Daily Temperature across Europe is over 35 degrees', 
            ['#1E90FF', '#00BFFF', '#40E0D0', '#00CED1', '#00FA9A',
             '#7CFC00', '#ADFF2F', '#FFFF00', '#FFA500', '#FF4500', '#b33000'], 
            counter  // Pass the counter to show progressive years
        );
        if (counter >= 11) {
            clearInterval(window.animationInterval);
            console.log('Interval stopped');
        }
    }, 2000); 
}

function customgrpedbarfromcsv(file, html, title, xlab, ylab, rancol, val = 'ALL') {
    anychart.onDocumentReady(async function () {
        try {
            const data = await arraymaker(file);
            if (!data || data.length === 0) {
                console.error("No data loaded from CSV.");
                return;
            }
            
            const YEARS = [];
            for (let i = 0; i < data.length; i++) {
                if (!YEARS.includes(data[i]['YEAR'])) {
                    YEARS.push(data[i]['YEAR']);
                }
            }
            YEARS.sort();
            
            // If val is a number, show only that many years
            const displayYears = (typeof val === 'number') ? YEARS.slice(0, val) : YEARS;
            
            // Clear existing chart if it exists
            if (window.globalChart) {
                window.globalChart.dispose();
            }
            
            const chart = anychart.column();
            let YEARDICT = {};
            displayYears.forEach(year => YEARDICT[year] = []);
            
            for (let i = 0; i < data.length; i++) {
                const year = data[i]['YEAR'];
                if (YEARDICT[year]) { // Only add data for years we're displaying
                    YEARDICT[year].push([data[i]['DAY'], parseFloat(data[i]['COUNT_OVER_35'])]);
                }
            }
            
            const seriesMap = {};
            
            for (let i = 0; i < displayYears.length; i++) {
                const year = displayYears[i];
                const dataarr = YEARDICT[year];
                const bar = chart.column(dataarr);
                
                if (rancol == 'YES') {
                    const transparency = 0.7;
                    let colorran = getRandomColor();
                    bar.fill(colorran + Math.round(transparency * 255).toString(16).padStart(2, '0'));
                    bar.stroke({color: colorran, thickness: 2});
                } else {
                    const transparency = 0.7;
                    // Use modulo to cycle through colors safely
                    let colorran = rancol[i % rancol.length];
                    bar.fill(colorran + Math.round(transparency * 255).toString(16).padStart(2, '0'));
                    bar.stroke({color: colorran, thickness: 2});
                }
                
                bar.name(year.toString());
                seriesMap[year] = bar;
            }
            
            window.globalChart = chart;
            chart.title(title);
            chart.title().fontSize(20);
            chart.legend().enabled(true);
            chart.legend().fontSize(10);
            chart.barGroupsPadding(0.3);
            chart.xAxis().title(xlab);
            chart.yAxis().title(ylab);
            chart.container(html);
            chart.draw();
            
        } catch (error) {
            console.error("Error initializing the chart:", error);
        }
    });
}

// Function to stop the animation manually
function stopYearAnimation() {
    if (window.animationInterval) {
        clearInterval(window.animationInterval);
        window.animationInterval = null;
        console.log('Animation stopped manually');
    }
}
