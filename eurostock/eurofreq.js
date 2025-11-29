function arraymaker(fileloc) {
    return new Promise((resolve, reject) => {
        // Construct the static URL dynamically for Django
        const staticFilePath = fileloc;

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
            console.log(staticFilePath)
            .catch(error => {
                console.error(`Error loading the CSV file from ${fileloc}:`, error);
                reject(error);
            });
    });
}

async function drawfreqdens(file, container, xaxis, yaxis, title, column, scol, ecol, sname) {
            const data = await arraymaker(file)
            const densdata = []
            for (let i=0; i< data.length; i++){
                densdata.push(parseFloat(data[i][column]))
            }
            maxVal = Math.max(...densdata)
            minVal = Math.min(...densdata)
            interval = (maxVal - minVal) / 150
            const binSize = interval; 
            const histogram = {};
            
            densdata.forEach(v => {
              const bin = Math.floor(v / binSize) * binSize;
              histogram[bin] = (histogram[bin] || 0) + 1;
            });
            const histData = Object.entries(histogram).map(([x, y]) => [parseFloat(x), y]);
            histData.sort((a, b) => a[0] - b[0]);
            chart = new Highcharts.Chart(container, {
                title: {
                    text: title
                },
                series: [{
                    name: sname,
                    type: 'areaspline',
                    color: {
                                linearGradient: { x1: 0, y1: 0, x2: 1, y2: 0 }, // gradient
                                stops: [
                                [0,scol ], // Start color 
                                [1, ecol]  // End color 
                                ]
                            },
                    data: histData,
                    tooltip: {
                        valueDecimals: 2
                    }
                    
                }],
                xAxis: {
                    plotLines:[
                        {
                            color: '#0062ffff',
                            width: 2,
                            value: 0.0
                        }
                    ],
                    title: {
                        text:xaxis
                    }
                },
                yAxis: {
                    title: {
                        text: yaxis
                    }
                }
            });
        }
