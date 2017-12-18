$(document).ready(function() {

    myApp.loadData();

});

// Load JSON + CSV files
myApp.loadData = function() {

    // Date parser (https://github.com/mbostock/d3/wiki/Time-Formatting)
    var formatDate = d3.time.format("%Y");

    // Use the Queue.js library to read in data
    queue()    
        .defer(d3.json, "data/mn-county.json")
        .defer(d3.csv, "data/mn_farms.csv")                 
        .await(function(error, usMap, mnData){

            // Convert numeric values to 'numbers'
            mnData.forEach(function(d){

                // Convert string to 'date object'
                d.hh_mail_decile        = +d.hh_mail_decile;
                d.stat        = +d.stat;
                //d.num_deaths = +d.num_deaths.replace(/\,/g,'') 
            });            

            //Pass in processed data here
            myApp.createVis(usMap, mnData);
        });
};

myApp.createVis = function (usMap, mnData) {

    console.log(mnData);
    console.log(usMap)
    var map = new myApp.Choropleth("map-area", usMap, mnData);

}


