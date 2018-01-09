app.controller('TeamTrackerController', ['$scope', function($scope){
	
	$scope.test = "teamtracker.html";
	
	// plan and run types, create new data style
	var data = [
	{"name": "Matt", "startTime":new Date("Tue Jan 09 07:30:00 EST 2018"), "endTime": new Date("Tue Jan 09 10:30:00 EST 2018"), "taskName":"get coffee", "status":"RUNNING"} ];
	
	var init = function() {
		
	}
	
	// http://bl.ocks.org/dk8996/5449641
	// http://bl.ocks.org/mpmckenna8/96eba3f746e859e5b4cef685178c14fb
	
	$scope.drawChart = function() { 
		var taskNames = [ "Hello" ];
		var gantt = d3.gantt().taskTypes(taskNames).taskStatus(taskStatus);
		gantt(tasks);
		
	
		var width = 960 - margin.left - margin.right;
		var height = 500 - margin.top - margin.bottom;
			
		var svg = d3.select("body").selectAll("svg")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom)
				.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
				
		
	}
	
	
	
	
}]);
	