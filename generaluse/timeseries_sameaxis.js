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


function isDateValid(dateStr) {
  return isNaN(new Date(dateStr));
}

async function drawtimeseries(file, container, title, xaxis, yaxis,colours){
            const data = await arraymaker(file);
            const linedata = []
            const yearlyavg = {}
            const cols = Object.keys(data[0]).filter(item => item !== '' && item !== 'DATE');
            for (let i=0; i<data.length; i++){
                date = data[i]['DATE'];
                if (isDateValid(date)){
                datey = date.substring(0,4);
                datem = date.substring(4,6);
                dated = date.substring(6,8);
                empty = ""
                final = empty.concat(datey,"-",datem,"-",dated)
                }
                else {
                    final = date
                }
                row = {
                x: new Date(final).getTime(),
            
        };
        for (let k=0; k<cols.length; k++){
            coltitle = cols[k]
            row[coltitle] = data[i][coltitle]
        }
    
        linedata.push(row);
        }
        const seriesdata = []
        for (let k=0; k<cols.length; k++){
            coltitle = cols[k]
            colour = colours[k]
            dataitem = []
            for (let i=0; i<linedata.length; i++){
                date = linedata[i]['x'];
                y = parseFloat(linedata[i][coltitle])
                row = [date, y]
                dataitem.push(row)}

            seriesdata.push({
                    name: coltitle,
                    type: 'line',
                    data: dataitem,
                    color: colour,
                    tooltip: {
                                            valueDecimals: 2
                                        }
            }
            )
        }
        chart = new Highcharts.Chart({
                chart: {
                renderTo: container,
                type: 'line'  // Set chart type to line
                        },
                title: {
                    text: title,
                        style: {
fontSize: '30px'
                        }
                },
                series: seriesdata,
                xAxis: {
                    type: 'datetime',  // Important for time series
                    title: {
                        text: xaxis,
                        style: {
fontSize: '24px'
                        }
                    },
                },
                yAxis: {
                    title: {
                        text: yaxis,
                        style: {
fontSize: '24px'
                        }
                    }
                    
                },
                legend: {
        itemStyle: {
            fontSize: '18px', // Font size for legend items
            fontWeight: 'normal'
        },
        itemHoverStyle: {
            color: '#000', // Optional: color on hover
            fontWeight: 'bold'
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
