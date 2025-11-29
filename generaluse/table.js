function arraymaker(fileloc) {
    return new Promise((resolve, reject) => {
        // Construct the static URL dynamically if needed for Django
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
                    header: false, // Set to true if the CSV has headers
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
function tablepop(table, fileloc) {
// Construct the static URL dynamically if needed for Django
const staticFilePath = `/static/${fileloc}`;

// Fetch the CSV file
fetch(staticFilePath)
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
    })
    .then(csvData => {
        // Parse the CSV data using PapaParse
        Papa.parse(csvData, {
            header: false, // Set to true if the CSV has headers
            skipEmptyLines: true, // Ignore empty lines
            complete: function(results) {
                populateTable(table, results.data);
            }
        });
    })
    .catch(error => {
        console.error(`Error loading the CSV file from ${fileloc}:`, error);
    });
}

// Helper function to populate the table
function populateTable(table, data) {
// Clear the existing rows, if any
table.innerHTML = '';

// Populate the table with rows and columns
data.forEach(row => {
    let tr = document.createElement("tr");
    row.forEach(col => {
        let td = document.createElement("td");
        td.textContent = col;
        tr.appendChild(td);
    });
    table.appendChild(tr);
});
}
