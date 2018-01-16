app.controller('GroupedBarsController', ['$scope', function($scope) {
	$scope.test = 'test';

	$scope.draw = function() {
		drawChart();
	}


// adapted from https://bl.ocks.org/bricedev/0d95074b6d83a77dc3ad
	var drawChart = function() {


		var margin = {
			top : 20,
			right : 40,
			bottom : 20,
			left : 150
		};

		var width = 800;
		var height = 500; 

		/*var xScale = d3.scaleLinear()
		.range([0, width])
		.domain([0, 50]); */

		var xScale = d3.scaleBand()
		.range([0, width])
		.round(.1);

		var xScaleTask = d3.scaleBand();
		var yScale = d3.scaleLinear().range([0, height]);

		var xAxis = d3.axisBottom().scale(xScale).tickSize(0);

		var yAxis = d3.axisLeft().scale(yScale);

		var svg = d3.select('body').selectAll('svg')
					.attr("width", width + margin.left + margin.right)
					.attr("height", height + margin.top + margin.bottom);

		var data = [ 
		{
			"type":"type1",
				"values": [
					{
						"value":10,
						"task":"dust"
					},
					{
						"value":20,
						"task":"sweep"
					}
				]
			},
			{
			"type":"type2", 
				"values": [
					{
						"value":5,
						"task":"eat"
					},
					{
						"value":35,
						"task":"sleep"
					}
				]
			}
		];


		var types = data.map(function(d) { return d.type; });
		var tasks = data[0].values.map(function(d) { return d.task; });

		xScale.domain(types);
		xScaleTask.domain(tasks).range([0, xScale.bandwidth()]);
		yScale.domain([0, d3.max(data, function(types) {
			 return d3.max(types.values, function(d) {
			 	return d.value;
			 }); 
			})]);

		svg.append("g") 
			.attr("class", "x axis")
			.attr("transform", "translate(0," + height + ")")
			.call(xAxis);

		svg.append("g")
			.attr("class", "y axis")
			.style('opacity', '0')
			.call(yAxis);

		var bars = svg.selectAll(".bars") 
		.data(data)
		.enter();

		bars.selectAll("rect")
		.data(function(d) { return d.values; })
		.enter()
		.append("rect")
		.attr("width", 50)
		.attr("x", function(d) { return xScaleTask(d.task); })
		.attr("y", function(d) { return height - yScale(0); });

	}

}]);