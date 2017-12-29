var app = angular.module("demoApp", ['ngMaterial', 'ngRoute']);


app.config(function ($routeProvider) {
	// 'unselected' or 'base' html for demo-web-app/ or demo-web-app/#/ URLs? So we don't get the htdocs MAMP directory
	$routeProvider
		.when('/', {
			templateUrl: 'views/product.html'
		})
		.when('/contact', {
			controller: 'ContactController',
			templateUrl: 'views/contact.html'
			
		})
		.when('/product', {
			controller: 'ProductController',
			templateUrl: 'views/product.html'
		})
		.when('/linechart', {
			controller: 'LinechartController',
			templateUrl: 'views/linechart.html'
		})
		.when('/crossfilterdemo', {
			controller: 'CrossfilterdemoController',
			templateUrl: 'views/crossfilterdemo.html'
		})
		.when('/fourbars', {
			controller: 'FourBarsController',
			templateUrl: 'views/fourbars.html'
		})
		.otherwise({
			redirectTo: 'views/product.html'
		});
});


app.factory('barFactory', function() {
	

	
	return{
		
		test: function() {
			console.log("Test of factory!");
		},
		
		drawBarChart_old: function(id, margin, width, height, xScale, yScale) {
			
			//console.log("called with id = " + id);
			// adapting from https://bl.ocks.org/hrecht/f84012ee860cb4da66331f18d588eee3
			// and http://bl.ocks.org/kiranml1/6872226
			
				
			var numTicks = 6;
			var grid = d3.range(numTicks).map(function(i){
				return {'x1':0,'y1':0,'x2':0,'y2':500 - margin.top - margin.bottom};
			});

			var tickVals = grid.map(function(d,i){
				if(i>0){ return i*50; }
				else if(i===0){ return "100";}
			});
				
				
			//var svg = d3.select(id).append("svg")
			var svg = d3.select(id).selectAll("svg")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom)
				.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
				
				
			var tickSkip = (960 + margin.left + margin.right) / numTicks;

								
			// grid lines for ticks
		/*	var grids = svg.append('g')
					  .attr('id','grid')
					  //.attr('transform','translate(0,-10)')
					  .selectAll('line')
					  .data(grid)
					  .enter()
					  .append('line')
					  .attr('x1', function(d, i) { return tickSkip * i; })
					  .attr('y1', function(d){ return d.y1; })
					  .attr('x2', function(d,i){ return tickSkip * i; })
					  .attr('y2', function(d){ return d.y2; })
					  .style('stroke', '#adadad')
					  .style('stroke-width', '1px');*/

			var yAxis = d3.axisLeft(yScale).tickSize(0);
			
			var xAxis = d3.axisBottom(xScale).tickSize(1).tickSizeInner(-height);

			
		//	.style( { 'stroke' : 'black', 'stroke-width' : '1px');

			var gy = svg.append("g")
				.attr("class", "yaxis")
				.call(yAxis);
				
			var gx = svg.append("g")
					 .attr("class", "xaxis")
					 .attr("transform", "translate(0,470)")
					 .call(xAxis);

			
			return svg;
		},
	
		// returns key,value pair reduced data as an array of just the values for use with d3
		cleanData: function(data) {
			
			var cleanedData = [];
			for(var i = 0; i < data.length; i++){
				cleanedData.push(data[i].value);
				console.log("(i = " + i + ") Sum of values at " + data[i].key + ": " + data[i].value);
			}
			
			return cleanedData;
		},
		
		// where xaxis is a string, so we can have n differnt x-axes 
		reduce: function(dimension, xAxis) {
			
			function reduceAdd(p, v) {
				return p + v[xAxis];
			}

			function reduceRemove(p, v) {
				return p - v[xAxis];
			}

			function reduceInitial() {
				return 0;
			}
				
			return dimension.group().reduce(reduceAdd, reduceRemove, reduceInitial).all();
			
		}
	}

});