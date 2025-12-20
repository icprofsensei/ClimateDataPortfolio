function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
function arraymaker(fileloc) {
    return new Promise((resolve, reject) => {
        // Construct the static URL dynamically for Django
        const staticFilePath =fileloc;

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
function drawrangesplinefromcsv(file, html, title, xlab, ylab, rancol, col1, col2, z) {
    anychart.onDocumentReady(async function () {
        try {
            const data = await arraymaker(file);
            if (!data || data.length === 0) {
                console.error("No data loaded from CSV.");
                return;
            }

            const chart = anychart.cartesian();
            const cols = Object.keys(data[0]).filter(item => item !== 'x');
            console.log(z)
            for (let j = 0; j< (cols.length -1); j++){
                dataarrupper = []
                dataarrlower = []
                for (let i = 0; i < data.length; i ++) {
                    if (col1 == 'DATE' && data[i][col2[j]] >= z) {
                        dataarrupper.push( {x: new Date(data[i][col1]),low:parseFloat(z), high: parseFloat(data[i][col2[j]])} )
                    }
                    else {
                        dataarrupper.push( {x: new Date(data[i][col1]),low:parseFloat(z), high: parseFloat(z)} )
                    }
                    if (col1 == 'DATE' && data[i][col2[j]] < z) {
                        dataarrlower.push( {x: new Date(data[i][col1]),low:parseFloat(data[i][col2[j]]), high: parseFloat(z) } )
                    }
                    else {
                        dataarrlower.push( {x: new Date(data[i][col1]),low: parseFloat(z), high: parseFloat(z) } )
                    }
                
                }
                const upperSeries = chart.rangeSplineArea(dataarrupper);
                upperSeries.name(`Overvalued`);
                upperSeries.fill('red', 0.3);  
                upperSeries.stroke('red', 0.1);
                const lowerSeries = chart.rangeSplineArea(dataarrlower);
                lowerSeries.name(`Undervalued`);
                lowerSeries.fill('blue', 0.3);  
                lowerSeries.stroke('blue', 0.1);

                
            }
            chart.legend().enabled(true);
            chart.legend().fontSize(10);
            chart.title(title);
            chart.title().fontSize(20)
            if (col1.toUpperCase() == 'DATE') {
                chart.xScale('date-time'); 
                chart.xAxis().labels().format(function () {
                    var date = new Date(this.value);
                    return date.toLocaleDateString();
                });
            } else {
                chart.xAxis().labels().format(function (value) {
                    return Math.round(value);
                });
            }
            chart.xAxis().title(xlab);
            chart.yAxis().title(ylab);
            chart.container(html);
            chart.draw();
        } catch (error) {
            console.error("Error initializing the chart:", error);
        }
    });
}
