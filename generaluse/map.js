function jsonfetch(fileloc) {
    return fetch(`/fileloc`)
      .then(response => {
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        return response.json(); // Directly parse JSON
      })
      .catch(error => {
        console.error(`Error loading JSON file from ${fileloc}:`, error);
        throw error;
      });
  }
  
  function arraymaker(fileloc) {
    return fetch(concat('/', fileloc))
      .then(response => {
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        return response.text();
      })
      .then(csvData => {
        return new Promise((resolve, reject) => {
          Papa.parse(csvData, {
            header: true,
            skipEmptyLines: true,
            worker: true, // Use a web worker to parse large CSV files
            complete: results => resolve(results.data),
            error: reject
          });
        });
      })
      .catch(error => {
        console.error(`Error loading CSV file from ${fileloc}:`, error);
        throw error;
      });
  }
  var series = null; // Store series globally

  function mapfiller(row, html, title, map) {
    let result = Object.keys(row).map(key => ({ id: key, value: Number(row[key]) }));
    year = row['Year']
    if (!series) {
      series = map.choropleth(result);
      
      series.geoIdField("ISO_A2");
      
      const viridisColors = ["#7c4d87", "#7f69a1", "#7880ac", "#6f95b0", "#67a8b0", "#62bbac", "#72cda1", "#99dc8b", "#cbe86b", "#feee66"];
      series.colorScale(anychart.scales.linearColor(viridisColors));
      series.stroke('white');
      
      var cr = map.colorRange().enabled(true);
      cr.orientation('top');
      map.container(html);
      map.draw();
    } else {
      series.data(result); 
    }
  
    map.title(title + " "+ year);
  }

var id = null;
var currentIndex = 0;
var map = null; 

function drawmap(file, file2, html, title, start, stop) {
  anychart.onDocumentReady(async function () {   
    try {
      if (!map) {
        map = anychart.map(); 
      }
      
      const [geojson, reference] = await Promise.all([
        jsonfetch(file),
        arraymaker(file2)
      ]);
      
      map.geoData(geojson);
      
      document.getElementById(start).addEventListener('click', function() {
        if (id !== null) clearInterval(id);
        id = setInterval(() => updateMap(reference, html, title), 1000);
      });

      document.getElementById(stop).addEventListener('click', function() {
        if (id !== null) clearInterval(id);
        id = null;
      });

    } catch (error) {
      console.error("Error initializing the chart:", error);
    }
  });
}

function updateMap(reference, html, title) {
  if (currentIndex >= reference.length) currentIndex = 0;
  mapfiller(reference[currentIndex], html, title, map);
  currentIndex++;
}
