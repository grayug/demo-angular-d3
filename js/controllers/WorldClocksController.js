app.controller('WorldClocksController', ['$scope', function($scope){
	
	$scope.date = new moment();
	
	$scope.date = moment.tz("America/Los_Angeles").format('hh:mm a');
	$scope.dates = [];
	//{members: 0, funds: 0};
	$scope.cities = [
					{key: "New York, New York", value: "America/New_York"}, 
					{key: "Chicago, Illinois", value: "America/Chicago"},
					{key: "Abidjan, Cote d'Ivoire", value: "Africa/Abidjan"},
					{key: "Cancun, Mexico", value: "America/Cancun"},
					{key: "Honolulu, Hawaii", value: "Pacific/Honolulu"},
					{key: "Vienna, Austria", value: "Europe/Vienna"}];
					
	$scope.addDate = false;
	$scope.addSeconds = false;
	$scope.twentyfourHourClock = false;
	
	
	var init = function() {
		
		for(var i = 0; i < $scope.cities.length; i++) {
			console.log($scope.cities[i].key + " " + $scope.cities[i].value);
			$scope.dates.push(moment.tz($scope.cities[i].value).format("hh:mm a"));
		}
		
		//$scope.dates.push(moment.tz(new moment(), "America/Sao_Paulo").utc().format("YYYY-MM-DD HH:mm:ss");
		//$scope.test = $scope.dates[0];
	}
	
	$scope.update = function() {
		
		var formatString = "";
		
		
		if($scope.addDate) {
			formatString += "DD-MM-YYYY ";
		}
		
		if($scope.twentyfourHourClock) {
			formatString += "HH";
		} else {
			formatString += "hh";
		}
		
		formatString += ":mm"
		
		if($scope.addSeconds) {
			formatString += ":ss";
		}
		
		// add am/pm to format 
		if(!$scope.twentyfourHourClock) {
			formatString += " a";
		}
		console.log("Format string: " + formatString);
		
		$scope.$evalAsync(function() { 
			for(var i= 0 ; i < $scope.cities.length; i++) {
				$scope.dates[i] = moment.tz($scope.cities[i].value).format(formatString); //$scope.dates[i].format(formatString);
			}
		});
	}
	
	$(document).ready(function() {
		$scope.update();
		setInterval($scope.update, 1000);
	});
	
	init(); 
	//moment().format();
}]);
	
	