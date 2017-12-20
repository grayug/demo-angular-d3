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
	$scope.attributes = ["color", "alpha", "shape", "country"];
	$scope.dimensions = [];
	$scope.reduced = [];
	
	$scope.fourBarsInit = function() {
		
		d3.json("dataFourCat.json", function(error, data) {
			if(error) throw error;
			
			$scope.data = data.data;
			var cf = crossfilter($scope.data);
			// set up initial dimensions 
			for(var i = 0; i < $scope.attributes.length; i++){
				
				
				var dimension = cf.dimension(function(p) { console.log(p[$scope.attributes[i]]); return p[$scope.attributes[i]]; });

				$scope.dimensions.push(dimension);
				//$scope.dimensions.push(cf.dimension(function(p) { console.log("yo"); console.log("dimension of " + p[$scope.attributes[i]]); return p[$scope.attributes[i]]; }));
			
				$scope.reduced.push(barFactory.mapReduce($scope.dimensions[i]));
				
				// testing if the reduced array is set properly 
				var currentData = $scope.reduced[i];
				
				// close
				for(var j = 0; j < currentData.length; j++){
	
					console.log(currentData[j].key + " = " + currentData[j].value);
				}
				
				// TODO: giving undefined = undefined, should be 
				//console.log(($scope.reduced[i])[0].key + " = " + ($scope.reduced[i])[0].value);
				//console.log("Dimension = " + $scope.dimensions[i]);
			}
			
		});
		
	}
	
	$scope.drawChart = function(key, value) {
		// create dimension for current chart
		
		var cf = crossfilter(data);

		//dimensions.push(
		var dimension = cf.dimension(function(p) { return p.key });
	//	crossfilter 
	//	$scope.dimensions[
	}
}]);