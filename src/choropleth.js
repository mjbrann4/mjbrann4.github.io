myApp.Choropleth = function(_parentElement, _usMap, _mnData){
    this.parentElement = _parentElement;
    this.usMap = _usMap; 
    this.mnData  = _mnData;
    this.initVis();
    count = 0;
}

/*=================================================================
* Initialize visualization (static content, e.g. SVG area or axes)
*=================================================================*/

myApp.Choropleth.prototype.initVis = function(){
    var vis = this;

    vis.margin = {top: 50, right: 50, bottom: 50, left: 50};

    vis.width = 800 - vis.margin.left - vis.margin.right;

    vis.height = 500 - vis.margin.top - vis.margin.bottom;

    vis.svg = d3.select("#map-area").append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)

    vis.g = vis.svg.append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

    vis.map = vis.g.append("g")
        .attr("transform", "translate(100,100)");

    //Set colorscale # of buckets
    vis.colorBuckets = 7;

    //Set colorscale range
    vis.colorScale = d3.scale.quantize()
        .range(colorbrewer.BuGn[vis.colorBuckets]);
        //.range(colorbrewer.Reds[vis.colorBuckets]);

    //Define map projection
    vis.projection = d3.geo.albersUsa()
        .translate([150, 600])
        .scale([3500]);

    //Define default path generator
    vis.path = d3.geo.path()
        .projection(vis.projection);

    // TO-DO: (Filter, aggregate, modify data)
    vis.wrangleData();
}

/*=================================================================
* Data Wrangling
*=================================================================*/
myApp.Choropleth.prototype.wrangleData = function(){
    var vis = this;

    vis.filteredData = vis.mnData.filter(function (value) {
        return (value.hh_mail_decile == -99);
    });

    console.log(vis.filteredData)
    // Update the visualization
    vis.updateVis();
}


/*=================================================================
 * The drawing function - should use the D3 update sequence 
 * Function parameters only needed if different kinds of updates are needed
*=================================================================*/

 myApp.Choropleth.prototype.updateVis = function(){
    var vis = this;

    //color domain
    var domainExtent = d3.extent(d3.values(vis.filteredData), function(d) { return d.stat; });
    vis.colorScale.domain(domainExtent);

    //Initialize tooltip for Map
    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .style("text-align", "center");

    vis.map.call(tip);

    //add tip function
    tip.html(function (d) {
        return "County: " + d.properties.NAME + "<br>Farm: " + d.values.farm_name +  "<br>Available Households: " + d.values.stat
    });


    vis.usMap.features.forEach(function(d) {
        var entity = vis.filteredData.filter(function(x) {
            return d.properties.COUNTY === $.trim(x.county_fips);
        })[0];
        if(entity) {
            d.values = entity;
        } else {
            d.values = {farm_name: 'NONE', hh_mail_decile: -99, stat: 0};
        }
    });


    vis.map.selectAll(".counties")
        .data(vis.usMap.features)
        .enter()
        .append("path")
        .attr("class", "counties")
        .attr("d", vis.path)
        .attr("fill", function(d) { 
            if (d.values.farm_name === "NONE") {
                return '#C0C0C0'
            }
            else {
                return vis.colorScale(d.values.stat);
            }
        })
        .style("stroke", "grey")
        .style("stroke-width", ".5")
        .style("cursor", "pointer")
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide)
        .on('click', function(d) {
            count = count + 1;
            vis.getData(d);
        });
   
}

 myApp.Choropleth.prototype.getData = function(d) {
    var vis = this;

    //filter fulldata to this state only
    var thisCounty = d.properties.COUNTY;
    console.log(thisCounty)
    vis.countyData = vis.mnData.filter(function (value) {
        return (value.county_fips == thisCounty & value.hh_mail_decile != -99);
    });
    //console.log(vis.countyData);

    //build new chart
    setTimeout(function() {
        var lineGraph = new myApp.LineGraph("line-graph-area", vis.countyData, count);
        //var lineGraph = new myApp.LineGraph("line-graph-area", vis.countyData, count);
    }, 50)

    //remove existing chart
    myApp.removeGraph(vis.countyData);
}












