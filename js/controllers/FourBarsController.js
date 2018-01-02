// unused right now
app.directive("directiveTest", function() {
		
	return {
		restrict: 'E',
		scope: {
			// params
			name: '=?',
			id: '=?'
		},
	//	controller:
//template: "<div ng-init='fourBarsInit()'>  <div ng-repeat='dat in data'> {{ dat }} {{$index}} </div> </div>"
	};
});


app.controller('FourBarsController', ['$scope', 'barFactory', function($scope, barFactory){
	
	
	// TODO, better var names + cleanup
	
	var margin = {
		top: 15,
		right: 25,
		bottom: 15,
		left: 60
	};	
	var width = 850  - margin.left - margin.right;
	var height = 500 - margin.top - margin.bottom;
	
	var domainMax = [];
	var domainMaxRounded = [];
	
	
	// attributes in json
	$scope.attributes = ["color", "letter", "shape", "country"];
	// default
	$scope.selected = "funds";
	$scope.ifLoaded = false;
	$scope.filteredOn = ["", "", "", ""];
	$scope.domains = ["members", "funds"];
	$scope.data;
	
	//$scope.fourBarsInit = function() {
	var init = function(updateChart) {
		
		$scope.dimensions = [];
		$scope.reduced = [];
		//$scope.filteredOnString += "dog";
		
		d3.json("dataFourCat.json", function(error, data) {
			
			console.log("in d3.json");
			if(error) throw error;
			
			// reset dimensions and reduced in case of re-init
			while ($scope.dimensions.length) { $scope.dimensions.pop(); }
			while ($scope.reduced .length) { $scope.reduced.pop(); }
			$scope.dimensions.length = 0;
			$scope.reduced.length = 0;
			$scope.ifLoaded = false;
			
			$scope.data = data.data;
			var cf = crossfilter($scope.data);
			
			var tempcf = crossfilter($scope.data);
			var tempDimensions = [];
			var tempReduced = [];
			// set up initial dimensions 
			for(var i = 0; i < $scope.attributes.length; i++){
				
				
				var dimension = cf.dimension(function(p) { return p[$scope.attributes[i]]; });

				$scope.dimensions.push(dimension);
				//tempDimensions.push(dimension
				//$scope.dimensions.push(cf.dimension(function(p) { console.log("yo"); console.log("dimension of " + p[$scope.attributes[i]]); return p[$scope.attributes[i]]; }));
			
				$scope.reduced.push(barFactory.reduce($scope.dimensions[i], $scope.domains));//, $scope.selected));
				//$scope.filteredOn[i] = "chart " + $scope.attributes[i] + ":";
				
				// testing if the reduced array is set properly 
				var currentData = $scope.reduced[i];
				
				// (it is)
				//for(var j = 0; j < currentData.length; j++){
	
				//	console.log(currentData[j].key + " = " + currentData[j].value);
			//	}
			
				console.log(currentData);
				var data = barFactory.cleanData(currentData, $scope.selected);
				console.log("in init: bar factory cleaned: " + data);
			}
			

			// for getting max vals 
			var temp = [];
				for(i = 0; i < $scope.attributes.length; i++) {
					var current = $scope.reduced[i];
					for(j = 0; j < current.length; j++) {
						temp.push(current[j].value);
					}
				}
			
	//		console.log(temp);
			
			$scope.domainMax = [];
			$scope.domainMaxRounded = [];
			
			
			for(var j = 0; j < $scope.domains.length; j++) {
				

				// get max X
				domainMax[$scope.domains[j]] = d3.max(temp, function(d) {
					return d[$scope.domains[j]];
				});
				
				// round to nearest 50
				domainMaxRounded[$scope.domains[j]] = Math.ceil(domainMax[$scope.domains[j]] / 50) * 50;
			}
			console.log(domainMax);
			console.log(domainMaxRounded);
			
			for(i = 0; i < $scope.attributes.length; i++) {
				if(updateChart) {
					var currentData = $scope.reduced[i];
					var data = barFactory.cleanData(currentData, $scope.selected);
					var idToSelect = "#" + $scope.attributes[i];
					d3.select(idToSelect).selectAll("svg").selectAll("rect.bar")
						.data(data)
							.transition()
							.duration(1000)
						.style("fill", "black")						
						.attr("width", function(d) {return $scope.xScale(d); });		
						//$scope.filteredOnString = "";
						$scope.filteredOn = ["", "", "", ""];
				}
				// first time drawing chart 
				else {		
					drawChart(i);
				}
			}
			
			
			$scope.ifLoaded = true;
		});
		
	}


	var drawChart = function(index) {
		
			console.log("in drawChart (index = " + index + ")");
			//console.log("Called with index: " + index);
		
			//console.log($scope.reduced[index]);
			var reducedData = $scope.reduced[index];
			
				
			var xScale = d3.scaleLinear()
				.range([0, width])
				.domain([0, domainMaxRounded[$scope.selected]]);
			$scope.xScale = xScale;

			var yScale = d3.scaleBand()
				.rangeRound([height, 0])
				.domain(reducedData.map(function (d) {
					return d.key;
			}));
				
			var idString = "#" + $scope.attributes[index];
			// get empty chart
			var svg = barFactory.drawBarChart_old(idString, margin, width, height, xScale, yScale);
			//console.log(svg);
			
			// make clean data function in factory, pass in reduced[index]
			
			var cleanedData = [];
			var categories = [];
			for(i = 0; i < reducedData.length; i++){
				categories.push(reducedData[i].key);
				cleanedData.push(reducedData[i].value[$scope.selected]);
			}
	
			// div for tooltip -- this can be added to barFactory's drawBarChart later 
			// tooltip code and mouseover events adapted from http://bl.ocks.org/d3noob/a22c42db65eb00d4e369
			var div = d3.select(idString).append("div")
				.attr("class", "tooltip")				
				.style("opacity", 0);
			
			// draw bars
			var bars = svg.selectAll(".bar")
			.data(cleanedData)
			.enter()
			.append("g");


			//append rects
			bars.append("rect")
				.attr("class", "bar")
				.attr("y", function (d, i) {
					return yScale(categories[i]) + 50;
				})
				.attr("height", yScale.bandwidth() / 2)
				.attr("x", 0)
				.style("fill", "black")
				.attr("width", function (d, i) {
					return xScale(cleanedData[i]);
				})
				.on("mouseover", function(d, i) {		

					var selected = $scope.reduced[index];

					div.transition()		
						.duration(200)		
						.style("opacity", .9);		
					div.html(" Category: " + selected[i].key + "<br/>Members: " + selected[i].value["members"] + "<br/>Funds: " + selected[i].value["funds"])
					
					// get this bar's location and place it there?
						.style("left", 100 + "px")		
						.style("top", yScale(categories[i]) + 110 + "px");	
					})					
				.on("mouseout", function(d) {		
					div.transition()		
						.duration(500)		
						.style("opacity", 0);	
				}) 
				.on('click', function(d,i) {
					svg.selectAll("rect.bar").style("fill", "grey");
					d3.select(this).style("fill", "black");
					
				
					var currentDimension = $scope.dimensions[index];
					
					
					//filter current dimension on selected key
					currentDimension.filter(reducedData[i].key);
														
					// set all chart's data to volume of selected bar
					var currentData = [];
					for(var j = 0; j < $scope.attributes.length; j++) {
						
						var idToSelect = "#" + $scope.attributes[j];
						
						currentData.length = 0;
						
						var reduced = $scope.reduced[j];
						
						console.log("selecting " + idToSelect);


						for(var k = 0; k < $scope.reduced[j].length; k++){
							currentData[k] = reduced[k].value[$scope.selected];
						}
						
						// To tell which chart is filtered on what, working on getting this working (well) still...
						// doesn't fire changed event for angular, but calling a random empty method will ( test() ).
						if(j != index) {
							$scope.filteredOn[j] += " " + $scope.attributes[index] + "(" + reducedData[i].key + ");";
						}
						console.log("filtered on: " + $scope.filteredOn);


						for(var k = 0; k < currentData.length; k++){
							console.log("data" + "("+reduced[k].key+"[i=" +k+"]): " + currentData[k]);
						}
						

						d3.select(idToSelect).selectAll("svg").selectAll("rect.bar")
							.data(currentData)
								.transition()
								.duration(1000)
							.style("fill", "blue")
							.attr("width", function(d) {return $scope.xScale(d); });

				}
				console.log("--------------------------------");
			});			
	}
	
	$scope.test = function() {
		console.log("test");
	}
	
	// on radio button change
	$scope.updateChartToNewXAxis = function() {
		
		console.log("Changing chart X axis to " + $scope.selected);
		
		// change xScale
		var xScale = d3.scaleLinear()
			.range([0, width])
			.domain([0, domainMaxRounded[$scope.selected]]);
		$scope.xScale = xScale;
		
	
		// set data to selected
		for(i = 0; i < $scope.attributes.length; i++) {
			var currentData = $scope.reduced[i];
			var idToSelect = "#" + $scope.attributes[i];
			
			var xAxis = d3.axisBottom(xScale).tickSize(1).tickSizeInner(-height);;
			d3.select(idToSelect).selectAll("svg").select(".xaxis")
				.transition()
				.duration(1000)
				//.attr("transform", "translate(0,470)")
				.call(xAxis);
				
				d3.select(idToSelect).selectAll("svg").selectAll("rect.bar")
					.data(barFactory.cleanData(currentData, $scope.selected))
						.transition()
						.duration(1000)
					.style("fill", "black")						
					.attr("width", function(d) {return $scope.xScale(d); });		
				//	$scope.filteredOn = ["", "", "", ""];
		}
	}
	

	// call private init function with update chart boolean specified 
	$scope.reset = function()
	{
		// call init with update chart boolean set to true
		init(true); 
	}
	
	
	/* call private init on controller (page) load */
	init(false);

}]);