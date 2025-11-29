function arraymaker(fileloc) {
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

function calculateAverage(arr) {
  let sum = 0;
  for (let i = 0; i < arr.length; i++) {
    sum += parseFloat(arr[i]);
  }
  return (sum / arr.length);
}


async function drawtimeseries(file, container1, title1, xaxis1, yaxis1, container2, title2, xaxis2, yaxis2){
            const data = await arraymaker(file);
            const linedata = []
            const yearlyavg = {}
            for (let i=0; i<data.length; i++){
                date = data[i]['DATE'];
                datey = date.substring(0,4);
                datem = date.substring(4,6);
                dated = date.substring(6,8);
                empty = ""
                final = empty.concat(datey,"-",datem,"-",dated)
                linedata.push({
            x: new Date(final).getTime(),
            y: parseFloat(data[i]['TX']/10)
        });
            if (!yearlyavg[datey]) {
                        yearlyavg[datey] = [];
                        
                    }
          yearlyavg[datey].push(parseFloat(data[i]['TX']) / 10);
    
            }
            linedata.sort((a, b) => a.x - b.x);
            const sortedYears = Object.keys(yearlyavg).sort();
            const lline = []
            const uline = []
            const mline = []
            for (const year of sortedYears) {
                if (year != 2025){
                    const values = yearlyavg[year];
                    values.sort((a, b) => a - b);
                    
                    const min = values[0];
                    const max = values[values.length - 1];
                    const avg = calculateAverage(values);
                    lline.push(min);
                    uline.push(max);
                    mline.push(avg);
                    }
                }
            const llinemap = sortedYears.map((item, index) => [item, lline[index]]);
            const ulinemap = sortedYears.map((item, index) => [item, uline[index]]);
            const mlinemap = sortedYears.map((item, index) => [item, mline[index]]);
        chart = new Highcharts.Chart({
                chart: {
                renderTo: container1,
                type: 'line'  // Set chart type to line
                        },
                title: {
                    text: title1
                },
                series: [{
                    name: 'Annual Minimum',
                    type: 'line',  // Set series type to line
                    color: 'blue',
                    data: llinemap,
                    tooltip: {
                        valueDecimals: 2
                    }
                },
            {
                    name: 'Annual Maximum',
                    type: 'line',  // Set series type to line
                    color: 'red',
                    data: ulinemap,
                    tooltip: {
                        valueDecimals: 2
                    }
                },
                {
                    name: 'Annual Average',
                    type: 'line',  // Set series type to line
                    color: 'green',
                    data: mlinemap,
                    tooltip: {
                        valueDecimals: 2
                    }
                }
            ],
                xAxis: {
                    type: 'datetime',  // Important for time series
                    title: {
                        text: xaxis1
                    },
                },
                yAxis: {
                    title: {
                        text: yaxis1
                    }
                },
                tooltip: {
                    formatter: function() {
                        return Highcharts.dateFormat('%Y-%m-%d', this.x) + '<br/>' +
                            '<b>' + this.series.name + ':</b> ' + this.y;
                    }
                },
                responsive: {
                        rules: [{
                                    condition: {
                                        maxWidth: 500
                                    },
                                }]
                            }
                })
        chart = new Highcharts.Chart({
                chart: {
                renderTo: container2,
                type: 'line'  // Set chart type to line
                        },
                title: {
                    text: title2
                },
                series: [{
                    name: 'Madrid',
                    type: 'line',  // Set series type to line
                    color: {
                        linearGradient: { x1: 0, y1: 0, x2: 1, y2: 0 },
                        stops: [
                            [0, '#fffc33ff'],
                            [1, '#ffe101ff']
                        ]
                    },
                    data: linedata,
                    tooltip: {
                        valueDecimals: 2
                    }
                }],
                xAxis: {
                    type: 'datetime',  // Important for time series
                    title: {
                        text: xaxis2
                    },
                    plotLines: [
                        {
                            color: '#0062ffff',
                            width: 2,
                            value: 0.0
                        }
                    ]
                },
                yAxis: {
                    title: {
                        text: yaxis2
                    }
                },
                tooltip: {
                    formatter: function() {
                        return Highcharts.dateFormat('%Y-%m-%d', this.x) + '<br/>' +
                            '<b>' + this.series.name + ':</b> ' + this.y;
                    }
                },
                responsive: {
                        rules: [{
                                    condition: {
                                        maxWidth: 500
                                    },
                                }]
                            }
                })    
}
