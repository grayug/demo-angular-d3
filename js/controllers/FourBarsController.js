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
	var width = 800  - margin.left - margin.right;
	var height = 500 - margin.top - margin.bottom;
	
	var domainMax;
	var domainMaxRounded;
	
	
	// attributes in json
	$scope.attributes = ["color", "letter", "shape", "country"];
	// default
	$scope.selected = "members";
	//$scope.reduced;
	$scope.ifLoaded = false;
	$scope.filteredOn = ["", "", "", ""];
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
			
				$scope.reduced.push(barFactory.reduce($scope.dimensions[i], $scope.selected));
				//$scope.filteredOn[i] = "chart " + $scope.attributes[i] + ":";
				
				// testing if the reduced array is set properly 
				var currentData = $scope.reduced[i];
				
				// (it is)
				//for(var j = 0; j < currentData.length; j++){
	
				//	console.log(currentData[j].key + " = " + currentData[j].value);
			//	}
			
				var data = barFactory.cleanData(currentData);
				console.log("in init: bar factory cleaned: " + data);
				
				// moved down below domainMax calc
				/*if(updateChart) {
					var idToSelect = "#" + $scope.attributes[i];
				//	d3.select(id).selectAll("svg").selectAll("rect.bar").data(cleanedDataset).transition().duration(1000).attr("width", function(d) { return xScale(d); });
					d3.select(idToSelect).selectAll("svg").selectAll("rect.bar")
						.data(barFactory.cleanData(currentData))
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
				} */
			}
			
			//var temp_cf = crossfilter($scope.data);
			var temp = [];
			for(i = 0; i < $scope.attributes.length; i++) {
				var current = $scope.reduced[i];
				for(j = 0; j < current.length; j++) {
					temp.push(current[j].value);
				}
			}
			
			console.log(temp);
			
			// get max X
			domainMax = d3.max(temp, function(d) {
				return d;
			});
			// round to nearest 50
			domainMaxRounded = Math.ceil(domainMax / 50) * 50;
			console.log("max = " + domainMax + " rounded up = " + domainMaxRounded);
			
			for(i = 0; i < $scope.attributes.length; i++) {
				if(updateChart) {
					var currentData = $scope.reduced[i];
					var data = barFactory.cleanData(currentData);
					var idToSelect = "#" + $scope.attributes[i];
				//	d3.select(id).selectAll("svg").selectAll("rect.bar").data(cleanedDataset).transition().duration(1000).attr("width", function(d) { return xScale(d); });
					d3.select(idToSelect).selectAll("svg").selectAll("rect.bar")
						.data(barFactory.cleanData(currentData))
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
				.domain([0, domainMaxRounded]);
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
				cleanedData.push(reducedData[i].value);
			//	console.log("(i = " + i + ") Sum of values at " + reducedData[i].key + ": " + reducedData[i].value);
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
					var reducedFunds = [];
					var reducedMembers = [];
					
					for(var j = 0; j < $scope.attributes.length; j++){
						reducedFunds.push(barFactory.reduce($scope.dimensions[j], "funds"));
						reducedMembers.push(barFactory.reduce($scope.dimensions[j], "members"));			
					}
					
					var selected = $scope.reduced[index];
					var selectedFunds = reducedFunds[index];
					var selectedMembers = reducedMembers[index];
			
					div.transition()		
						.duration(200)		
						.style("opacity", .9);		
					//div.html("Category: " + reduced[i].key + "<br/>" + "Members: " + reduced[i].value)
					// doesn't matter which we select for key, since they'll both be the same
					//console.log("cat: " + selected[i].key + " dog: " + selected[i].value);
					console.log("category: " + selectedFunds[i].key);
					console.log("members: " + selectedMembers[i].value);
					console.log("funds: " + selectedFunds[i].value);
					div.html(" Category: " + selectedFunds[i].key + "<br/>Members: " + selectedMembers[i].value + "<br/>Funds: " + selectedFunds[i].value)
					// get this bar's location and place it there?
						.style("left", 100 + "px")		
						.style("top", 100 + "px");	
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
							currentData[k] = reduced[k].value;
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
		
		// create temp crossfilter + dimensions to get original max of Nth domain (selected)
		// (without worrying about filtered data)
		var tempcf = crossfilter($scope.data);
		var tempDimensions = [];
		var tempReduced = [];
		//var newReduced = [];
		for(var i = 0; i < $scope.attributes.length; i++) {	
		
			var dimension = tempcf.dimension(function(p) { return p[$scope.attributes[i]]; });

			tempDimensions.push(dimension);
		//	newReduced.push(barFactory.reduce($scope.dimensions[i], $scope.selected));
			tempReduced.push(barFactory.reduce(tempDimensions[i], $scope.selected));
			$scope.reduced[i] = barFactory.reduce($scope.dimensions[i], $scope.selected);
		}
	
		var temp = [];
		for(i = 0; i < $scope.attributes.length; i++) {
			var current = tempReduced[i];
			for(j = 0; j < current.length; j++) {
				temp.push(current[j].value);
			}
		}
		
		console.log(temp);
		
		// get max X
		domainMax = d3.max(temp, function(d) {
			return d;
		});
		// round to nearest 50
		var domainMaxRounded = Math.ceil(domainMax / 50) * 50;
		console.log("max = " + domainMax + " rounded up = " + domainMaxRounded);
		
			
		var xScale = d3.scaleLinear()
			.range([0, width])
			.domain([0, domainMaxRounded]);
		$scope.xScale = xScale;
		/*svg.append("g")
					 .attr("class", "xaxis")
					 .attr("transform", "translate(0,470)")
					 .call(xAxis);*/

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
					.data(barFactory.cleanData(currentData))
						.transition()
						.duration(1000)
					.style("fill", "black")						
					.attr("width", function(d) {return $scope.xScale(d); });		
				//	$scope.filteredOn = ["", "", "", ""];
		}
	}
	

	// call private init function with update chart specified 
	$scope.reset = function()
	{
		// call init with updateChart boolean set to true
		init(true); 
	}
	
	
	/* call private init on controller (page) load */
	init(false);

}]);