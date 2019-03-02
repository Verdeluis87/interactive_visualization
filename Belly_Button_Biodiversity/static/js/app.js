function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel
  // Use `d3.json` to fetch the metadata for a sample
  var url = "/metadata/" + sample;
  d3.json(url).then((sample) => {   
      // console.log(sample);
    // Use d3 to select the panel with id of `#sample-metadata`
      var metadata = d3.select("#sample-metadata");
    // Use `.html("") to clear any existing metadata
      metadata.html("");
      
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    Object.entries(sample).forEach(([key, value]) => {
      var row = metadata.append("p");
      // tags for each key-value in the metadata.
      row.text(`${key}: ${value}`);
    });
  });
      // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
    var url2 = "/metadata/wfreq" + sample
    d3.json(url).then((sample) =>{

    var level = ((sample.WFREQ*18)+10);

    // Trig to calc meter point
    var degrees = 180 - level,
        radius = .5;
    var radians = degrees * Math.PI / 180;
    var x = radius * Math.cos(radians);
    var y = radius * Math.sin(radians);
  
    // Path: may have to change to create a better triangle
    var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
        pathX = String(x),
        space = ' ',
        pathY = String(y),
        pathEnd = ' Z';
    var path = mainPath.concat(pathX,space,pathY,pathEnd);
  
    var data = [{ type: 'scatter',
      x: [0], y:[0],
        marker: {size: 28, color:'850000'},
        showlegend: false,
        name: '# of Showers',
        text: level,
        hoverinfo: 'text+name'},
      { values: [50/10, 50/10, 50/10, 50/10,50/10, 50/10, 50/10, 50/10, 50/10, 50/10, 50],
      rotation: 90,
      text: ['9','8','7','6','5', '4', '3', '2',
                '1', '0', ''],
      textinfo: 'text',
      textposition:'inside',
      marker: {colors:['rgba(51, 204, 51, .9)','rgba(51, 102, 0, .7)', 'rgba(51, 102, 0, .6)',
                            'rgba(110, 154, 22, .7)', 'rgba(110, 154, 22, .5)',
                            'rgba(170, 202, 42, .5)', 'rgba(202, 209, 95, .5)',
                            'rgba(210, 206, 145, .5)', 'rgba(232, 226, 202, .5)',
                            'rgba(255, 255, 204, .5)','rgba(255, 255, 255, 0)']},
      labels: ['9','8','7','6','5', '4', '3', '2',
                '1', '0', ''],
      hoverinfo: 'label',
      hole: .5,
      type: 'pie',
      showlegend: false
    }];
  
    var layout = {
      shapes:[{
          type: 'path',
          path: path,
          fillcolor: '850000',
          line: {
            color: '850000'
          }
        }],
      title: 'Belly button washing frecuency',
      xaxis: {zeroline:false, showticklabels:false,
                showgrid: false, range: [-1, 1]},
      yaxis: {zeroline:false, showticklabels:false,
                showgrid: false, range: [-1, 1]}
    };
  
    Plotly.newPlot('gauge', data, layout);
  });
};




function buildCharts(sample) {
  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var url = "/samples/" + sample;
  d3.json(url).then((sample) => {   
    // @TODO: Build a Bubble Chart using the sample data
      var trace1 = {
        x: sample.otu_ids,
        y: sample.sample_values,
        mode: 'markers',
        text:sample.otu_labels,
        marker: {
          size: sample.sample_values,
          color: sample.otu_ids
        }
      };
      var data = [trace1];

      var layout = {
        xaxis:{title: "OTU ID"},
      };

      Plotly.newPlot('bubble', data, layout);     
    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
      var trace2 = [{
          values: sample.sample_values.slice(0,10),
          labels: sample.otu_ids.slice(0,10),
          type: 'pie',
          hoverinfo: sample.otu_labels.slice(0,10)
      }]

      Plotly.newPlot('pie', trace2)
})
};

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
