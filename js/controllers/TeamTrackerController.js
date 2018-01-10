app.controller('TeamTrackerController', ['$scope', function($scope){
	
	$scope.test = "teamtracker.html";
	
	// plan and run types, create new data style
	var data = [
	{"name": "Matt", "startTime":new Date("Tue Jan 09 07:30:00 EST 2018"), "endTime": new Date("Tue Jan 09 10:30:00 EST 2018"), "taskName":"get coffee", "status":"RUNNING"} ];

	// { {"name":"plan", ... }}
	
	
	var init = function() {
		$scope.drawChart();
	}
	
	// http://bl.ocks.org/dk8996/5449641
	// http://bl.ocks.org/mpmckenna8/96eba3f746e859e5b4cef685178c14fb
	
	$scope.drawChart = function() { 
		console.log("in drawChart");
		var taskNames = [ "Hello" ];
		var gantt = d3.gantt().taskTypes(taskNames).taskStatus(taskStatus);
		gantt(tasks);
		
	
		var width = 960 - margin.left - margin.right;
		var height = 500 - margin.top - margin.bottom;
		var test = d3.gantt(height).width(width).taskTypes(taskNames);
			
		var svg = d3.select("body").selectAll("svg")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom)
				.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
				
		
	}
	
	$scope.gantt = function () {
		
		
	}
	
	
	init();
	
}]);


// gantt 

var d3.gantt = function() {
	var margin = {
	top : 20,
	right : 40,
	bottom : 20,
	left : 150
	};
	
	var timeDomainStart =d3.timeDay.offset(new Date(),+7);
	var timeDomainEnd d3.timeHour.offset(new Date(), +3);
	var timeDomainMode = "fit";
	
	// define task types/bar color (status)
	
	var tickFormat = "%H:%M";
	
	var keyFunction = function(d) {
		return d.startTime + d.name + d.endTime;
	};
	
	var x,y,xAxis,yAxis;
	
	// blah
	
	var initTimeDomain = function() {
		
	}
	
	
	 function initAxis() {
		x = d3.scaleTime().domain([ timeDomainStart, timeDomainEnd ]).range([ 0, width ]).clamp(true);

		y = d3.scaleBand().domain(taskTypes).range([ 0, height - margin.top - margin.bottom ]).padding(0.1);

		xAxis = d3.axisBottom().scale(x).tickFormat(d3.timeFormat(tickFormat))
		  .tickSize(8).tickPadding(8);

		yAxis = d3.axisLeft().scale(y).tickSize(0);
	  };
	  
	  function gantt(task) {
		  
		  initTimeDomain;
		  initAxis;
		  
		  var svg = d3.select("body").selectAll("svg")
			.attr("class", "chart")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.append("g")
			.attr("class", "gantt-chart")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

			svg.selectAll(".chart")
			.data(tasks, keyFunction).enter()
			.append("rect")
			.attr("rx", 5)
			.attr("ry", 5)
			.attr("class", function(d){ 
			if(taskStatus[d.status] == null){ return "bar";}
			return taskStatus[d.status];
			}) 
			.attr("y", 0)
			.attr("transform", rectTransform)
			.attr("height", function(d) { return 70; })
			.attr("width", function(d) { 
			return (x(d.endDate) - x(d.startDate)); 
			});

			svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0, " + (height - margin.top - margin.bottom) + ")")
			.transition()
			.call(xAxis);

			svg.append("g").attr("class", "y axis").transition().call(yAxis);

			return gantt;
	  }
		  
		  
	  }
		
}
