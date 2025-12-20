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
function drawcustomcolbar(file, html, xlab, ylab, title) {
    anychart.onDocumentReady(async function () {
        try {
            const data = await arraymaker(file);
            if (!data || data.length === 0) {
                console.error("No data loaded from CSV.");
                return;
            }

            var chart = anychart.bar();
            var series = chart.bar(data);
            series.stroke(null)
            chart.xAxis().title(xlab);
            chart.yAxis().title(ylab);
            chart.title(title);
            chart.container(html);
            chart.draw();
        } catch (error) {
            console.error("Error initializing the chart:", error);
        }
    });
}
