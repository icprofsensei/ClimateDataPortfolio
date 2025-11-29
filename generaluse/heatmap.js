let section = document.querySelector('section');
let secwid = section.clientWidth;
let sechei = section.clientHeight;

function arraymakerheat(fileloc) {
    return new Promise((resolve, reject) => {
        // Construct the static URL dynamically for Django
        const staticFilePath = `fileloc`;

        // Fetch the CSV file
        fetch(staticFilePath)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.text();
            })
            .then(csvData => {
                // Parse the CSV data using PapaParse
                Papa.parse(csvData, {
                    header: true, // Set to true if the CSV has headers
                    skipEmptyLines: true, // Ignore empty lines
                    complete: function(results) {
                        resolve(results.data);
                    }
                });
            })
            .catch(error => {
                console.error(`Error loading the CSV file from ${fileloc}:`, error);
                reject(error);
            });
    });
}
function drawheatmap(file, element, title, xlab, ylab) { 
    anychart.onDocumentReady(async function () {
        try {
            const rawData = await arraymakerheat(file);

            if (!rawData || rawData.length === 0) {
                console.error("No data loaded from CSV.");
                return;
            }
            const headers = Object.keys(rawData[0]).filter(key => key !== "");

            // Transform raw data into the format required by AnyChart heatMap
            const data = [];
            for (let i = 0; i < rawData.length; i++) {
                const row = rawData[i];
                const rowLabel = row[""]; // Row label is stored in the "" key
                for (const header of headers) {
                    data.push({
                        x: header, // Column label
                        y: rowLabel, // Row label
                        heat: parseFloat(row[header]) || 0 // Ensure values are numeric
                    });
                }
            }

            // Create the heatmap chart
            const chart = anychart.heatMap(data);
            const viridisColors = [
                "#7c4d87", "#7f69a1", "#7880ac", "#6f95b0", 
                "#67a8b0", "#62bbac", "#72cda1", "#99dc8b", 
                "#cbe86b", "#feee66"
              ];
    
            chart.height(sechei);
            chart.margin(0);
            chart.xAxis().title(xlab)
            chart.yAxis().title(ylab)
            chart.xAxis().labels().fontSize(10);
            chart.yAxis().labels().fontSize(10);
            chart.legend(true);
            // Set heatmap title and color scale (optional)
            chart.title(title);
            // Set the container id
            chart.container(element);
            chart.title().fontSize(18);
            chart.colorScale(anychart.scales.linearColor(viridisColors));
            if (secwid <= 900){
                chart.yAxis().labels().enabled(false);
                chart.xAxis().labels().enabled(false);
                chart.legend().fontSize(10).itemsLayout("horizontal-expandable");
                var tooltip = chart.tooltip();
                tooltip.positionMode("point"); 
                tooltip.format("Row: {%y}\nColumn: {%x}\nValue: {%heat}")  
            }
            
            // Draw the chart
            chart.draw();
        } catch (error) {
            console.error("Error initializing the chart:", error);
        }
    });
}
