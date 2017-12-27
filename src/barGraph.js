myApp.BarGraph = function(_parentElement, _data, _countyName, _chartID){
  this.parentElement = _parentElement;
  this.barData = _data;
  this.countyName = _countyName;
  this.chartID = _chartID;

  //console.log(this.countyData)

  this.initVis();
}


/*=================================================================
* Initialize visualization (static content, e.g. SVG area or axes)
*=================================================================*/

myApp.BarGraph.prototype.initVis = function(){
    var vis = this;

    vis.margin = {top: 50, right: 50, bottom: 50, left: 100};

    vis.width = 400 - vis.margin.left - vis.margin.right;

    vis.height = 300 - vis.margin.top - vis.margin.bottom;

    vis.svg = d3.select("#bar-graph-area").append("svg")
        .attr("id", "a" + vis.chartID)
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom);

    vis.g = vis.svg.append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

    // X and Y Scales
    vis.x = d3.scale.ordinal()
        .rangeRoundBands([0, vis.width], .05);

    vis.y = d3.scale.linear()
        .range([vis.height,0]); 

    //define X axis
    vis.xAxis = d3.svg.axis()
        .scale(vis.x)
        .orient("bottom");

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
        .text("Homeowner")
        .style("opacity", 0)
        .transition().duration(750).style("opacity", 1);

    //Y axis label
    vis.g.append("text")
        .attr("class", "axis-text")
        .attr("transform", "translate(-55," + (vis.height/2) + ")rotate(-90)")
        .text("Number of Households")
        .style("opacity", 0)
        .transition().duration(750).style("opacity", 1);

    // TO-DO: (Filter, aggregate, modify data)
    vis.wrangleData();
}

/*=================================================================
* Data Wrangling
*=================================================================*/
myApp.BarGraph.prototype.wrangleData = function(){
    var vis = this;

    //No data wrangling needed here for now

    // Update the visualization
    vis.updateVis();
}


/*=================================================================
 * The drawing function - should use the D3 update sequence 
 * Function parameters only needed if different kinds of updates are needed
*=================================================================*/

 myApp.BarGraph.prototype.updateVis = function() {
    var vis = this;

    //console.log(vis.barData)

    //Scale domains
    vis.x.domain(vis.barData.map(function(d) { return d.group_value; }));
    vis.y.domain([0, d3.max(vis.barData, function(d) { return d.stat; })]);

    //Initialize tooltip for Map
    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .style("text-align", "center");

    vis.g.call(tip);

    //add tip function
    tip.html(function (d) {
        return "Count: " + d.stat
    });

    var bars = vis.g.selectAll("bar")
        .data(vis.barData)
        .enter().append("rect")
        .attr("class", "bar")
        //.style("fill", "steelblue")
        .attr("x", function(d) { return vis.x(d.group_value); })
        .attr("width", vis.x.rangeBand())
        .attr("y", function(d) { return vis.y(d.stat); })
        .attr("height", function(d) { return vis.height - vis.y(d.stat); })
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);


    //County Name label
    var text = vis.g.selectAll("title-text.text")
        .data(vis.countyName)
        .enter()
        .append('text')
        .attr("class", "title-text")
        .attr("transform", "translate(" + (vis.width/2) + "," + (-10) + ")")
        .text(function(d) {return "Number of Homeowners in  " + d + " County";})
        .style("opacity", 0)
        .transition().duration(750).style("opacity", 1);

    //Update X axis
    vis.svg.select(".x-axis")
        .call(vis.xAxis);

    //Update Y axis
    vis.svg.select(".y-axis")  
        .call(vis.yAxis);

   
}
