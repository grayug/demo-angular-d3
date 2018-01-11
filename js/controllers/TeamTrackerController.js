app.controller('TeamTrackerController', ['$scope', function($scope){
	
	$scope.test = "teamtracker.html";
	
	/* chart 24 hours start -> end */
	 var start = new Date("Wed Jan 10 7:00 CST 2018");
	 var end = new Date("Thu Jan 11 7:00 CST 2018");


	
	// plan and run types, create new data style
	var data = [
		{"type":"plan", "name":"Brian", "startTime":new Date("Wed Jan 10 5:00 CST 2018"), "endTime": new Date("Wed Jan 10 12:00 CST 2018"), "status":"RUNNING"},
		{"type":"actual", "name":"Brian", "startTime":new Date("Wed Jan 10 9:00 CST 2018"), "endTime": new Date("Wed Jan 10 16:00 CST 2018"), "status":"RUNNING"},

		{"type":"plan", "name": "AJ", "startTime":new Date("Wed Jan 10 8:00 CST 2018"), "endTime": new Date("Wed Jan 10 9:30 CST 2018"), "status":"JAMMED"},
		{"type":"actual", "name": "AJ", "startTime":new Date("Wed Jan 10 8:00 CST 2018"), "endTime": new Date("Wed Jan 10 9:30 CST 2018"), "status":"JAMMED"},

		{"type":"plan", "name": "Nina", "startTime":new Date("Wed Jan 10 7:30 CST 2018"), "endTime": new Date("Wed Jan 10 8:45 CST 2018"), "status":"RUNNING" },
		{"type":"actual", "name": "Nina", "startTime":new Date("Wed Jan 10 9:30 CST 2018"), "endTime": new Date("Wed Jan 10 8:45 CST 2018"), "status":"JAMMED"}
	];
    
	var taskStatus = {
        "NOT_STARTED" : "black",
        "JAMMED" : "red",
        "RUNNING" : "green",
        "MAINTENANCE" : "yellow"
	};

	var tasknames = ["AJ", "Brian", "Nina"];
	var tasktypes = ["plan", "actual"];
	var init = function() {
		$scope.drawChart();
	}
	
	// http://bl.ocks.org/dk8996/5449641
	// http://bl.ocks.org/mpmckenna8/96eba3f746e859e5b4cef685178c14fb
	
	$scope.drawChart = function() { 
		console.log("in drawChart");
		//var taskNames = [ "Hello" ];
		var gantt = d3.gantt().taskNames(tasknames).taskTypes(tasktypes).taskStatus(taskStatus).width(800).height(450);
		gantt(data);
		
		gantt.timeDomain([ d3.timeDay.offset(start, end)]);
	}
	
	// gantt 

d3.gantt = function() {
	
	var FIT_TIME_DOMAIN_MODE = "fit";
	var FIXED_TIME_DOMAIN_MODE = "fixed";

	var margin = {
		top : 20,
		right : 40,
		bottom : 20,
		left : 150
	};
	
	var timeDomainStart = d3.timeDay.offset(new Date(),-3);
	var timeDomainEnd = d3.timeHour.offset(new Date(), +3);
	var timeDomainMode = "fixed";
	var taskTypes = [];
	var taskNames = [];
	var taskStatus = [];
	var height = document.body.clientHeight - margin.top - margin.bottom-5;
	var width = document.body.clientWidth - margin.right - margin.left-5;
	
	// define task types/bar color (status)

	
	var tickFormat = "%H:%M";
	
	var keyFunction = function(d) {


		return taskTypes.map(function (taskType) {
			//to get one bar for each variable, start with the
			//array of variable names, and use a map function
			//to create data objects for each:

			// type, name, startTime, endTime
			return {
				type: taskType,
				name: d.name,
				startTime: d[taskType],
				endTime: d[taskType]
			};

			for (var i = 0; i < d.length; i++) {
				return d[i].startTime + d[i].name + d[i].endTime;
			}
		});
	};
	
	var rectTransform = function(d) {

		return "translate(" + x(d.startTime) + "," + y(d.name) + ")";
	};

	
	var x,y,xAxis,yAxis, yAxisLines;
	
	// blah
	initAxis();
	
	var initTimeDomain = function() {
		/*if (timeDomainMode === FIT_TIME_DOMAIN_MODE) {
		  if (data === undefined || data.length < 1) {
			timeDomainStart = d3.timeDay.offset(new Date(), -3);
			timeDomainEnd = d3.timeHour.offset(new Date(), +3);
			return;
		  }
		  
		  data.sort(function(a, b) {
			return a.endTime - b.endTime;
		  });
		  
		  timeDomainEnd = end;
		 
		 data.sort(function(a, b) {
			return a.startTime - b.startTime;
		  });
		  
		timeDomainStart = start;
    }
		
		
		timeDomainStart = data[0].startTime;
		timeDomainEnd = data[data.length - 1].endTime; */

		timeDomainStart = start;
		timeDomainEnd = end;
	}
	
	
	 function initAxis() {
		 // pick date here
		 
		x = d3.scaleTime().domain([ start, end ]).range([ 0, width ]).clamp(true);

		y = d3.scaleBand().domain(taskNames).range([ 0, height - margin.top - margin.bottom ]).padding(0.1);

		 // todo, lines like in the picture
        yLines = d3.scaleBand().domain(taskNames).range([0, height - margin.top - margin.bottom+30]).padding(0.1);

		xAxis = d3.axisBottom().scale(x).tickFormat(d3.timeFormat(tickFormat))
		  .ticks(24);

		yAxis = d3.axisLeft().scale(y).tickSize(0);

       // yAxisLines = d3.axisLeft().scale(yLines).tickSize(-width).tickFormat("");
	  }
	  
	  function gantt(data) {
		  
		  initTimeDomain();
		  initAxis();
		  
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
			.data(data, keyFunction)
				.enter()
			.append("rect")
			.attr("rx", 5)
			.attr("ry", 5)
			.style("fill", function(d) {
				return taskStatus[d.status];
			})
			.attr("y", 0)
			.attr("transform", rectTransform)
			.attr("height", function(d) { return 40; })
			.attr("width", function(d) {
				// map?
				return data.map(function(d) { return x(d.endTime) - x(d.startTime); });
			//	return (x(d.endTime) - x(d.startTime));
			})

		  /*	svg.selectAll(".chart-actual")
			.data(actual, keyFunction).enter()
			.append("rect")
			.attr("rx", 5)
			.attr("ry", 5)
			.style("fill", function(d) {
					return taskStatus[d[0].status];

			//	return taskStatus[d.status];
			})
                // second style for other rect here
		/*	.attr("class", function(d){
				if(taskStatus[d.status] == null){ return "bar";}
				console.log(taskStatus[d.status]);
				return taskStatus[d.status];
			}) */
			.attr("y", 0)
			.attr("transform", rectTransform)
			.attr("height", function(d) { return 40; })
			.attr("width", function(d) {
				for(var i = 0; i < d.length; i++) {
					return (x(d.endTime) - x(d.startTime));
				}
			});


			  svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0, " + (height - margin.top - margin.bottom) + ")")
			.transition()
			.call(xAxis);

			svg.append("g").attr("class", "y axis").transition().call(yAxis);
           // svg.append("g").attr("class", "y axis lines").transition().call(yAxisLines);

			return gantt;
	  }
	  
	 gantt.margin = function(value) {
		if (!arguments.length)
		  return margin;
		margin = value;
		return gantt;
	  };

	  gantt.timeDomain = function(value) {
		if (!arguments.length)
		  return [ timeDomainStart, timeDomainEnd ];
		timeDomainStart = +value[0], timeDomainEnd = +value[1];
		return gantt;
	  };

		/**
	  * @param {string}
	  *                vale The value can be "fit" - the domain fits the data or
	  *                "fixed" - fixed domain.
	  */
	  gantt.timeDomainMode = function(value) {
		if (!arguments.length)
		  return timeDomainMode;
		timeDomainMode = value;
		return gantt;

	  };

	  gantt.taskNames = function(value) {
		if (!arguments.length)
		  return taskNames;
		taskNames = value;
		return gantt;
	  };

	  gantt.taskStatus = function(value) {
		if (!arguments.length)
		  return taskStatus;
		taskStatus = value;
		return gantt;
	  };

	  gantt.taskTypes = function(value) {
		if (!arguments.length)
			return taskTypes;
		  taskTypes = value;
		return gantt;
		};

	  gantt.width = function(value) {
		if (!arguments.length)
		  return width;
		width = +value;
		return gantt;
	  };

	  gantt.height = function(value) {
		if (!arguments.length)
		  return height;
		height = +value;
		return gantt;
	  };

	  gantt.tickFormat = function(value) {
		if (!arguments.length)
		  return tickFormat;
		tickFormat = value;
		return gantt;
	  };

	  return gantt;		  
		  
  }
	
	init();
	
}]);



		
