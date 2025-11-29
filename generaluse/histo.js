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
        // Construct the static URL dynamically if needed for Django
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
function drawhisto(file, element, col, title, xlab) {
    anychart.onDocumentReady(async function () {
          try {
                const data = await arraymaker(file);
                if (!data || data.length === 0) {
                    console.error("No data loaded from CSV.");
                    return;
                }
                histarr = []
                for (let i =0; i< data.length; i++){
                    histarr.push(data[i]['x'])
                }
                var bins = [];
                var binCount = 0;
                var numOfBuckets = Math.max.apply(Math, histarr);
                var interval = numOfBuckets/25;

                //Setup Bins
                for(var i = 0; i < numOfBuckets; i += interval){
                bins.push({
                    binNum: binCount,
                    minNum: i,
                    maxNum: i + interval,
                    count: 0
                })
                binCount++;
                }
                for (var i = 0; i < histarr.length; i++){
                    var item = histarr[i];
                    for (var j = 0; j < bins.length; j++){
                      var bin = bins[j];
                      if(item > bin.minNum && item <= bin.maxNum){
                        bin.count++;
                        break;  // An item can only be in one bin.
                      }
                    }  
                  }
                
    
                // Format data for the chart
                const chartData = bins.map(({ minNum, maxNum, count }) => ({
                    x: `${minNum.toFixed(1)} - ${maxNum.toFixed(1)}`, // Interval label
                    value: count
                }));
    
                const chart = anychart.column();
                const histogram = chart.column(chartData);
    
                histogram.name("Frequency");
                histogram.fill(getRandomColor());
                histogram.stroke(col); 
    
                // Customize chart
                chart.title(title);
                chart.xAxis().title(xlab);
                chart.yAxis().title("Frequency");
                chart.barGroupsPadding(0);
                chart.container(element);
                chart.draw();
          } catch (error) {
                console.error("Error initializing the chart:", error);
          }
      });
  }
