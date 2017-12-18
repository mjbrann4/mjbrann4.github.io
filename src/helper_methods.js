myApp.removeGraph = function() {
	//myApp.LineGraph.prototype.name();

	if (count > 1) {
		var count_lag = count - 1;

	console.log("removing #a" + count_lag)

		//remove old graph
    	d3.selectAll("#a" + count_lag)
    	    .transition().delay(0).duration(0)
    	    .style("opacity", "0")
    	    .remove();
	}
}