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
function drawbox(file, container, title){
    anychart.onDocumentReady(async function () {
        try {
            const data = await arraymaker(file);

            if (!data || data.length === 0) {
                console.error("No data loaded from CSV.");
                return;
            }
            console.log(data)
            chart = anychart.box();
            series = chart.box(data);
            chart.container(container);
            chart.background().fill('white');
            chart.dataArea().background().fill('white');
            chart.title(title);
            if (window.innerWidth <= 900) {
                chart.xAxis().labels()
                    .fontSize(12)          // Decrease font size
                    .width(100)           // Enable text wrapping (width in pixels)
                    .wordWrap("normal")
                    .width(80) // Wrap words properly
                    .padding(0, 0, 20, 0); // Add more space below x-axis labels
            } else {
                chart.xAxis().labels()
                    .fontSize(25)          // Default font size
                    .width(null)           // Disable wrapping
                    .padding(0, 0, 10, 0); // Default padding
            }
            chart.draw();
}
catch (error) {
    console.error("Error initializing the chart:", error);
}
    })}
