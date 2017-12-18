myApp.LineGraph = function(_parentElement, _data, _chartID){
  this.parentElement = _parentElement;
  this.stateData = _data;
  this.chartID = _chartID;

  //console.log(this.stateData)

  this.initVis();
}

/*=================================================================
* Initialize visualization (static content, e.g. SVG area or axes)
*=================================================================*/

myApp.LineGraph.prototype.initVis = function(){
    var vis = this;

    vis.margin = {top: 100, right: 50, bottom: 50, left: 100};

    vis.width = 600 - vis.margin.left - vis.margin.right;

    vis.height = 400 - vis.margin.top - vis.margin.bottom;

    vis.svg = d3.select("#line-graph-area").append("svg")
        .attr("id", "a" + vis.chartID)
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom);

    vis.g = vis.svg.append("g")
        //.attr("id", "a" + vis.chartID)
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

    // X and Y Scales
    vis.x = d3.time.scale()
        .range([0, vis.width]);

    vis.y = d3.scale.linear()
        .range([vis.height,0]); 

    //define X axis (date)
    vis.xAxis = d3.svg.axis()
        .scale(vis.x)
        .orient("bottom")
        .tickFormat(d3.time.format("%Y"))
        .ticks(3);

    //define Y axis 
    vis.yAxis = d3.svg.axis()
        .scale(vis.y)
        .orient("left");             

    //Create X axis
    vis.g.append("g")
        .attr("class", "axis x-axis")
        .attr("transform", "translate(0," + (vis.height) + ")")
        .style("opacity", 0)
        .transition().duration(750).style("opacity", 1);

    //Create Y axis
    vis.g.append("g")
        .attr("class", "axis y-axis")
        .attr("transform", "translate(0,0)")
        .style("opacity", 0)
        .transition().duration(750).style("opacity", 1);

    //X axis label
    vis.g.append("text")
        .attr("class", "axis-text")
        .attr("transform", "translate(" + (vis.width/2) + "," + (vis.height + vis.margin.bottom/1.5) + ")")
        .text("Year")
        .style("opacity", 0)
        .transition().duration(750).style("opacity", 1);

    //Y axis label
    vis.g.append("text")
        .attr("class", "axis-text")
        .attr("transform", "translate(-45," + (vis.height/2) + ")rotate(-90)")
        .text("Number of Overdose Deaths")
        //.text("Overdose Rate per 100,000 people");
        .style("opacity", 0)
        .transition().duration(750).style("opacity", 1);


    // TO-DO: (Filter, aggregate, modify data)
    vis.wrangleData();
}

/*=================================================================
* Data Wrangling
*=================================================================*/
myApp.LineGraph.prototype.wrangleData = function(){
    var vis = this;

    //No data wrangling needed here for now

    // Update the visualization
    vis.updateVis();
}


/*=================================================================
 * The drawing function - should use the D3 update sequence 
 * Function parameters only needed if different kinds of updates are needed
*=================================================================*/

 myApp.LineGraph.prototype.updateVis = function() {
    var vis = this;

    //Scale domains
    vis.x.domain([d3.min(vis.stateData, function(d) { return d.year;}),
             d3.max(vis.stateData, function(d) { return d.year;})])

    vis.y.domain([d3.min(vis.stateData, function(d) { return d.num_deaths;})-5,
             d3.max(vis.stateData, function(d) { return d.num_deaths;})+5])

    //Line functions
    vis.line = d3.svg.line()
        .x(function(d) { return vis.x(d.year); })
        .y(function(d) { return vis.y(d.num_deaths); })
        .interpolate("monotone");  


    var formatDate = d3.time.format("%Y");

    //create defs to hold filters and line markers
    vis.defs = vis.svg.append("defs");

    vis.defs.append("linearGradient")
        .attr("id", "line-gradient")
        .attr("gradientUnits", "userSpaceOnUse")
        .attr("x1", vis.x(formatDate.parse('2013'))).attr("y1", 0)
        .attr("x2", vis.x(formatDate.parse('2015'))).attr("y2", 0)
        .selectAll("stop")
        .data([                             
            {offset: "0%", color: "#41ae76"},          
            {offset: "100%", color: "#41ae76"}    
        ])
        .enter().append("stop")
        .attr("offset", function(d) {return d.offset; })
        .attr("stop-color", function(d) {return d.color });

    //Create linegraph
    vis.linePath = vis.g.append("path")
        .datum(vis.stateData)
        .attr("class", "line")
        .attr("d", vis.line)
        .style("opacity", 0)
        .transition().duration(500).style("opacity", .7);

    var totalLength = vis.linePath.node().getTotalLength();
    
    vis.linePath
        .attr("stroke-dasharray", totalLength + " " + totalLength)
        .attr("stroke-dashoffset", totalLength)
        .transition()
            .duration(2000)
            .ease("linear")
            .attr("stroke-dashoffset", 0);


    //State label
    var text = vis.g.selectAll("title-text.text")
        .data(vis.stateData)
        .enter()
        .append('text')
        .attr("class", "title-text")
        .attr("transform", "translate(" + (vis.width/2) + "," + (-10) + ")")
        .text(function(d) {return "Overdose deaths in " + d.state;})
        .style("opacity", 0)
        .transition().duration(750).style("opacity", 1);


    //Update X axis
    vis.svg.select(".x-axis")
        .call(vis.xAxis);

    //Update Y axis
    vis.svg.select(".y-axis")  
        .call(vis.yAxis);

   
}
