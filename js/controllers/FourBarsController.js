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
	
	// attributes in json
	$scope.attributes = ["color", "letter", "shape", "country"];
	//$scope.dimensions;
	//$scope.reduced;
	$scope.ifLoaded = false;
	$scope.filteredOn = [];
	$scope.filteredOnString = "Filtered on:\n\tNothing yet!";
	
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
			// set up initial dimensions 
			for(var i = 0; i < $scope.attributes.length; i++){
				
				
				var dimension = cf.dimension(function(p) { return p[$scope.attributes[i]]; });

				$scope.dimensions.push(dimension);
				//$scope.dimensions.push(cf.dimension(function(p) { console.log("yo"); console.log("dimension of " + p[$scope.attributes[i]]); return p[$scope.attributes[i]]; }));
			
				$scope.reduced.push(barFactory.mapReduce($scope.dimensions[i]));
				$scope.filteredOn[i] = "chart " + $scope.attributes[i] + ":";
				
				// testing if the reduced array is set properly 
				var currentData = $scope.reduced[i];
				
				// (it is)
				//for(var j = 0; j < currentData.length; j++){
	
				//	console.log(currentData[j].key + " = " + currentData[j].value);
			//	}
			
				var data = barFactory.cleanData(currentData);
				console.log("in init: bar factory cleaned: " + data);
				
				if(updateChart) {
					var idToSelect = "#" + $scope.attributes[i];
				//	d3.select(id).selectAll("svg").selectAll("rect.bar").data(cleanedDataset).transition().duration(1000).attr("width", function(d) { return xScale(d); });
					d3.select(idToSelect).selectAll("svg").selectAll("rect.bar")
						.data(barFactory.cleanData(currentData))
							.transition()
							.duration(1000)
						.style("fill", "black")						
						.attr("width", function(d) {return $scope.xScale(d); });		
						$scope.filteredOnString = "";
						$scope.filteredOn.length = 0;
				}
				// first time drawing chart 
				else {		
					drawChart(i);
				}
				//drawChart(i);
			}
			$scope.ifLoaded = true;
		});
		
	}


	var drawChart = function(index) {
		
			console.log("in drawChart (index = " + index + ")");
			//console.log("Called with index: " + index);
		
			//console.log($scope.reduced[index]);
			var reducedData = $scope.reduced[index];

			var margin = {
				top: 15,
				right: 25,
				bottom: 15,
				left: 60
			};
			
			var width = 960 - margin.left - margin.right;
			var height = 500 - margin.top - margin.bottom;
			
			
			// get max X
			var domainMax = d3.max(reducedData, function(d) {
				return d.value;
			});
			// round to nearest 50
			var domainMax = Math.ceil(domainMax / 50) * 50;
			
				
			var xScale = d3.scaleLinear()
				.range([0, width])
				.domain([0, 250]);
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
				.on('click', function(d,i) {
					svg.selectAll("rect.bar").style("fill", "grey");
					d3.select(this).style("fill", "black");
					
				
					var currentDimension = $scope.dimensions[index];
					//console.log(barFactory.mapReduce(currentDimension));
					
					//var reduced
					for(var k = 0; k < reducedData.length; k++){
						console.log("reduced (before filter): " + reducedData[k].value);
					}
					
					//filter current dimension on selected key
					currentDimension.filter(reducedData[i].key);
				//	console.log(reducedData[i].key);
					
									
					
					// set all chart's data to volume of selected bar
					var currentData = [];
					for(var j = 0; j < $scope.attributes.length; j++) {
						
						// skip current selected chart 
						var idToSelect = "#" + $scope.attributes[j];
						
						currentData.length = 0;
						
						var reduced = $scope.reduced[j];
						
						console.log("selecting " + idToSelect);
						
						for(var k = 0; k < reduced.length; k++){
						console.log("reduced (after filter): " + reduced[k].value);
						}
					
						// set other elements to zero
					/*	if(j === index) {
							for(var k = 0; k < $scope.reduced[j].length; k++){
								// if we hit the current selected bar, leave it as is
								if(k === i){
									currentData[k] = reduced[k].value;
								} 
								
								// otherwise set to zero
								else {
								//	currentData[k] = reduced[k].value;
								//	currentData[k] = 0;
								//	reduced[k].value = 0;
								//	reduced.set(reduced[k].key, 0);
							//	($scope.reduced[j])[k].value = 0;
								}
							}
						} 
						// for every other chart than the one we're on, update the data 
						else {	*/
							//currentData = barFactory.cleanData($scope.reduced[j]);
							for(var k = 0; k < $scope.reduced[j].length; k++){
								currentData[k] = reduced[k].value;
							}
							
							// To tell which chart is filtered on what, working on getting this working (well) still...
							if(j != index) {
								$scope.filteredOn[j] += " " + $scope.attributes[index];
							}
							console.log("filtered on: " + $scope.filteredOn);
							
							// filteredOnString doesn't update in the view when this is updated
							// but it will when we press the reset button...
							//$scope.updateFilteredOnString($scope.filteredOn.toString()); 
								$scope.filteredOnString = $scope.filteredOn.toString();
					//	}

						for(var k = 0; k < currentData.length; k++){
							console.log("data" + "("+reduced[k].key+"[i=" +k+"]): " + currentData[k]);
						}
						

						d3.select(idToSelect).selectAll("svg").selectAll("rect.bar")
							.data(currentData)
								.transition()
								.duration(1000)
							.style("fill", "blue")
							.attr("width", function(d) {return xScale(d); });
						//$scope.filteredOnString = "dog!";
				}
				console.log("--------------------------------");
			});
			
	}
	

	// call private init function with update chart specified 
	$scope.reset = function()
	{
		init(true); 
		// ^ TODO
		// don't let drawChart be called in init, it's adding a seperate 'g' append to each chart (s.t. they can't be selected/modified after reset)
		// select all charts by index and update data to reset reduced dataset instead
	}
	init(false);
	
}]);