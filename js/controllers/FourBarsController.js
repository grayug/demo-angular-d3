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
	$scope.dimensions = [];
	$scope.reduced = [];
	$scope.ifLoaded = false;
	
	//$scope.fourBarsInit = function() {
	var init = function() {
		
		console.log("in init");
		d3.json("dataFourCat.json", function(error, data) {
			
			console.log("in d3.json");
			if(error) throw error;
			
			$scope.data = data.data;
			var cf = crossfilter($scope.data);
			// set up initial dimensions 
			for(var i = 0; i < $scope.attributes.length; i++){
				
				
				var dimension = cf.dimension(function(p) { /*console.log(p[$scope.attributes[i]]);*/ return p[$scope.attributes[i]]; });

				$scope.dimensions.push(dimension);
				//$scope.dimensions.push(cf.dimension(function(p) { console.log("yo"); console.log("dimension of " + p[$scope.attributes[i]]); return p[$scope.attributes[i]]; }));
			
				$scope.reduced.push(barFactory.mapReduce($scope.dimensions[i]));
				
				// testing if the reduced array is set properly 
				var currentData = $scope.reduced[i];
				
				// (it is)
				for(var j = 0; j < currentData.length; j++){
	
				//	console.log(currentData[j].key + " = " + currentData[j].value);
				}
			}
			$scope.ifLoaded = true;
		});
		
		console.log("leaving init");
		
	}
	
	
	// call private init function
	init();
	
	$scope.drawChart = function(index) {
		
			console.log("in drawChart (index = " + index + ")");
			//console.log("Called with index: " + index);
		
			//console.log($scope.reduced[index]);
			var reducedData = $scope.reduced[index];

			// todo: everything up until the factory drawBarChart call can be set to global variables in init 
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
				.domain([0, domainMax]);

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
					
					
					//filter current dimension on selected key
					currentDimension.filter(reducedData[i].key);
				//	console.log(reducedData[i].key);
					
					// update data ???
					
					// selected colors, so we want to select alpha
					
					// really bad hardcode/hack for filtering, working on fixing this rn!
					/*if(id === "#test") {
						idToSelect = "#test2";
						
						colorDimension.filter(dataset[i].key);
						for(var j = 0; j < dataset.length; j++){
							dataset2.push(alphabetResult[j].value);
						}
					
						
					// vice versa	
					} else {
						idToSelect = "#test";
						
						alphabetDimension.filter(dataset[i].key);
						for(var j = 0; j < dataset.length; j++){
							dataset2.push(colorResult[j].value);
						}
					
					}*/
					
					
					// reset current selected chart
				//	d3.select(idString).selectAll("svg").selectAll("rect.bar").data(cleanedData).transition().duration(1000).attr("width", function(d) { return xScale(d); });
					
					// set other chart's data to volume of selected bar
					var currentData;
					for(var j = 0; j < $scope.attributes.length; j++) {
						
						// skip current selected chart 
						if(j === index) {
							//console.log("j = " + j + " and selected index = " + index + " ( " + $scope.attributes[j] + " ) ");
							continue;
						} else {
							var idToSelect = "#" + $scope.attributes[j];
							
							currentData = [];
							
							/*
							var currentData = $scope.reduced[j];
							
							for(var k = 0; k < currentData.length; k++){

								console.log(currentData[k].key + " = " + currentData[k].value);
							}
							*/
							
							console.log("trying to select " + idToSelect);
							
							currentData = barFactory.cleanData($scope.reduced[j]);
							//console.log($scope.reduced[j]);
							var reduced = $scope.reduced[j];
							for(var k = 0; k < currentData.length; k++){
								console.log("data" + "("+reduced[k].key+"[i=" +k+"]): " + currentData[k]);
							}
							
							
							// doesn't like the new data for some reason?
							// fill changes, data doesn't (tho the data looks fine)
							d3.select(idToSelect).selectAll("svg").selectAll("rect.bar")
								.data(currentData)
									.transition()
									.duration(1000)
								.style("fill", "blue")
								.attr("width", function(d) { return xScale(d); });
						}
					}
			});
			
	}
	
}]);