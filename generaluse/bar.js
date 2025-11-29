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
        const staticFilePath = `/fileloc`;

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
function drawbar(file, html, title){
    anychart.onDocumentReady(async function () {
        try {
            const data = await arraymaker(file);
            if (!data || data.length === 0) {
                console.error("No data loaded from CSV.");
                return;
            }
            
            // Set chart properties
            chart = anychart.column();
            const bar = chart.column(data);
            bar.fill(getRandomColor());
            bar.name("Frequency");
            chart.title(title);
            chart.title().fontColor("black");
            chart.legend().fontColor("black");
            chart.legend().fontSize(13);
            chart.barGroupsPadding(0);
            chart.container(html);
            chart.background().fill("white"); 
            chart.draw();
        } catch (error) {
            console.error("Error initializing the chart:", error);
        }
    })}
