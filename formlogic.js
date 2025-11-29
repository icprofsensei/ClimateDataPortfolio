function generateNetwork() {
    // Get the form element
    const form = document.getElementById('network-config-form');
    
    // Retrieve form values
    const inputNeurons = parseInt(form.elements['input'].value);
    const hiddenLayers = parseInt(form.elements['hidden'].value);
    const neuronsPerLayer = parseInt(form.elements['neurons'].value);
    const outputNeurons = parseInt(form.elements['output'].value);

    // Construct the network dimensions object
    const networkDimensions = {
        input: inputNeurons,
    };

    for (let i = 1; i <= hiddenLayers; i++) {
        networkDimensions[`h${i}`] = neuronsPerLayer; // Add hidden layers dynamically
    }
    networkDimensions.output = outputNeurons;
    
    // Call the drawnetwork function with the constructed parameters
    drawnetwork(networkDimensions, 0.75, 'red', 'blue', 'purple');
}

function movingNetwork() {
    // Get the form element
    const form = document.getElementById('network-config-form');
    
    // Retrieve form values
    const inputNeurons = parseInt(form.elements['input'].value);
    const hiddenLayers = parseInt(form.elements['hidden'].value);
    const neuronsPerLayer = parseInt(form.elements['neurons'].value);
    const outputNeurons = parseInt(form.elements['output'].value);

    // Construct the network dimensions object
    const networkDimensions = {
        input: inputNeurons,
    };

    for (let i = 1; i <= hiddenLayers; i++) {
        networkDimensions[`h${i}`] = neuronsPerLayer; // Add hidden layers dynamically
    }
    networkDimensions.output = outputNeurons;
    
    // Call the drawnetwork function with the constructed parameters
    animatenetwork(networkDimensions, 0.75, 'red', 'blue', 'purple');
}
