var app = angular.module("demoApp", ['ngMaterial', 'ngRoute']);


app.config(function ($routeProvider) {
	$routeProvider
		.when('/', {
			templateUrl: '/'
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
		.otherwise({
			redirectTo: '/'
		});
});


// TODO: won't find controllers/ProductController.js but defined here it works
app.controller('ProductController', ['$scope', function($scope) {
	
	$scope.dog = 'img/wowee.jpg';
	
}]);


app.controller('ContactController', ['$scope', function($scope) {
		
    $scope.user = {
      name: '',
      email: '',
      company: '',
	  reason: '',
    };
	
}]);

app.controller('LinechartController', ['$scope', function($scope){
	
	$scope.linechartInit = function() {

		// Adapted code from https://bl.ocks.org/basilesimon/29efb0e0a43dde81985c20d9a862e34e
		// Recommended by Alex Micklow 
		
		
		var margin = {top: 20, right: 20, bottom: 30, left: 50},
			width = 960 - margin.left - margin.right,
			height = 500 - margin.top - margin.bottom;

		// parse the date / time
		var parseTime = d3.timeParse("%m/%d/%Y");

		// set the ranges
		var x = d3.scaleTime().range([0, width]);
		var y = d3.scaleLinear().range([height, 0]);

		// define the line
		var valueline = d3.line()
			.x(function(d) { return x(d.date); })
			.y(function(d) { return y(d.value); });
			
		  
		// append the svg obgect to the body of the page
		// appends a 'group' element to 'svg'
		// moves the 'group' element to the top left margin
		var svg = d3.select("body").selectAll("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
		  .append("g")
			.attr("transform",
				  "translate(" + margin.left + "," + margin.top + ")");

		function draw(data) {
		  
		  var data = data.data;
		  
		  // format the data
		  
		  
		  data.forEach(function(d) {
			  d.date = parseTime(d.date);
			  d.value = +d.value;
		  });
		  
		  // sort years ascending
		  /*
		  data.sort(function(a, b){
			return a["date"]-b["date"];
			})
			*/
		 
		  // Scale the range of the data
		  x.domain(d3.extent(data, function(d) { return d.date; }));
		  console.log
		  y.domain([0, d3.max(data, function(d) {
			  return d.value })]);
		  
		  // Add the valueline path.
		  svg.append("path")
			  .data([data])
			  .attr("class", "line")
			  .attr("d", valueline); 
		  // Add the X Axis
		  svg.append("g")
			  .attr("transform", "translate(0," + height + ")")
			  .call(d3.axisBottom(x));

		  // Add the Y Axis
		  svg.append("g")
			  .call(d3.axisLeft(y));
		  }
		  
		// Get the data
		d3.json("data.json", function(error, data) {
		  if (error) throw error;
		  
		  // trigger render
		  draw(data);
		});
			
	};
	
}]);

