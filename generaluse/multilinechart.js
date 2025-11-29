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
        const staticFilePath = concat('/', fileloc);

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
function drawmultilinechart(file, html, bgdcol, gencol, title, xlab, rancol, coldict) {
    anychart.onDocumentReady(async function () {
        try {
            const data = await arraymaker(file);
            if (!data || data.length === 0) {
                console.error("No data loaded from CSV.");
                return;
            }

            const chart = anychart.line();
            const cols = Object.keys(data[0]).filter(item => item !== 'x');
            for (let j = 0; j< cols.length; j++){
                dataarr = []
                for (let i = 0; i < data.length; i ++) {
                dataarr.push([data[i]['x'], data[i][cols[j]]])
                }
                const linegraph = chart.line(dataarr);
                if (rancol == 'YES'){
                linegraph.name(cols[j]).stroke({color: getRandomColor(), thickness: 3});
                }
                else {
                    col1 = coldict[cols[j]]
                    linegraph.name(cols[j]).stroke({color: col1, thickness: 2})
                }
            }
       

            // Set chart properties
            chart.background().fill(bgdcol);
            chart.dataArea().background().fill(bgdcol);
            chart.legend().enabled(true);
            chart.legend().fontColor(gencol);
            chart.legend().fontSize(10);
            chart.title(title);
            chart.title().fontSize(20);
            chart.title().fontColor(gencol);
            chart.xAxis().labels().fontColor(gencol);
            chart.xAxis().labels().format(function (value) {
                var value = this.value
            return Math.round(value);
        });
            chart.xAxis().title(xlab);
            chart.yAxis().labels().fontColor(gencol);
            chart.container(html);
            chart.draw();
        } catch (error) {
            console.error("Error initializing the chart:", error);
        }
    });
}
