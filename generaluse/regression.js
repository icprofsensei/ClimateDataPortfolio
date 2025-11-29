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
function drawregression(file, html, title, xlab, ylab, yint, grad, auto){
    anychart.onDocumentReady(async function () {
        try {
            const data = await arraymaker(file);
            if (!data || data.length === 0) {
                console.error("No data loaded from CSV.");
                return;
            }
            
            const xarr = data.map(obj => obj.x)
            var xmin = Math.min.apply(Math, xarr);
            var ymin = yint + (xmin * grad);
            var xmax = Math.max.apply(Math, xarr);
            var ymax = yint + (xmax * grad);
            var data2 = [
            {x: xmin, value: ymin},{x: xmax, value: ymax}
            ]
            // Set chart properties
            chart = anychart.scatter();
            const scatter = chart.marker(data);
            scatter.name(html);
            const line = chart.line(data2);
            if (auto == "YES"){
                col1 = '#2E77A2'
            line.stroke({color: col1, thickness: 2});
            scatter.fill('#B9DFF1')
            }
            else{col1 = getRandomColor()
                line.stroke({color: col1, thickness: 3});
                scatter.fill(getRandomColor())}
            
            chart.title(title);
            chart.title().fontColor("black");
            chart.legend().fontColor("black");
            chart.legend().fontSize(13);
            chart.xAxis().title(xlab);
            chart.yAxis().title(ylab);
            chart.xGrid(true);
            chart.yGrid(true);

            // configure the visual settings of major grids
            chart.xGrid().stroke({color: "#85adad", thickness: 0.7});
            chart.yGrid().stroke({color: "#85adad", thickness: 0.7});

            // enable minor grids
            chart.xMinorGrid(true);
            chart.yMinorGrid(true);

            // configure the visual settings of minor grids
            chart.xMinorGrid().stroke({color: "#85adad", thickness: 0.3, dash: 5});
            chart.yMinorGrid().stroke({color: "#85adad", thickness: 0.3, dash: 5});
            chart.container(html);
            chart.background().fill("white"); 
            chart.draw();
        } catch (error) {
            console.error("Error initializing the chart:", error);
        }
    })}
