// initialize page
function starting(){
    let subjectID = d3.select("#selDataset");
    
    d3.json("../../data/samples.json").then((data)=>{
        let sampleNames = data.names;

        sampleNames.forEach(sampleID => {
            // add new option
            let option = subjectID.append("option")

            // set text and value
            option.text(sampleID)
            option.property("value", sampleID)
        });

        // build bar chart
        buildBar(sampleNames[0]);

        // build buble chart
        buildBubble(sampleNames[0]);

        // display metadata
        displayMeta(sampleNames[0]);
    })
}
starting();


// create horizontal bar chart
function buildBar(sample){
    // get data
    d3.json("../../data/samples.json").then((data)=>{
        let allSampleData = data.samples;

        // filter data based on sample id in drop-down
        sampleDataArray = allSampleData.filter(item => item.id == sample)
        sampleData = sampleDataArray[0]

        // get top 10 OTUs & put in horizontal bar chart
        // rename y labels
        yaxis = sampleData['otu_ids'].slice(0,10).map(otu => `OTU ${otu}`).reverse()

        let barData = [
            {
              x: sampleData['sample_values'].slice(0,10).reverse(),
              y: yaxis,
              text: sampleData['otu_labels'].slice(0,10).reverse(),
              type: 'bar',
              orientation: 'h'
            }
          ];

        let barLayout = {
            title: 'Top 10 OTU',
            margin: { t: 50, l: 75 }
        }
        Plotly.newPlot('bar', barData, barLayout)
    })
}

// create bubble chart
function buildBubble(sample){
    // get data
    d3.json("../../data/samples.json").then((data)=>{
        let allSampleData = data.samples;

        // filter data based on sample id in drop-down
        sampleDataArray = allSampleData.filter(item => item.id == sample)
        sampleData = sampleDataArray[0]

        let bubbleData = [
            {
              x: sampleData['otu_ids'],
              y: sampleData['sample_values'],
              text: sampleData['otu_labels'],
              mode: 'markers',
              marker:{
                size: sampleData['sample_values'],
                color: sampleData['otu_ids']
              }
            }
          ];

        let bubbleLayout = {
            xaxis: {title: 'OTU ID'}
        }
        Plotly.newPlot('bubble', bubbleData, bubbleLayout)

    })
}

// display metadata
function displayMeta(sample){
    // get data
    d3.json("../../data/samples.json").then((data)=>{
        let allSampleMeta = data.metadata;

        // filter data based on sample id in drop-down
        sampleMetaArray = allSampleMeta.filter(item => item.id == sample)
        sampleMeta = sampleMetaArray[0]

        // select location to add metadata
        let demo = d3.select("#sample-metadata")

        // clear existing metadata
        demo.html("")

        // loop through each key in the metadata & display values
        Object.entries(sampleMeta).forEach(([key, value]) => {
            demo.append("h5").text(`${key}: ${value}`)
        });
    })
}

// update charts & metadata on change of drop-down

function optionChanged(sample){
    buildBar(sample);
    buildBubble(sample);
    displayMeta(sample);
}