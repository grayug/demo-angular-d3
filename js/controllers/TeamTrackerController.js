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

    // todo extend dataset
	var planData = [
		{"name":"Brian", "startTime":new Date("Wed Jan 10 5:00 CST 2018"), "endTime": new Date("Wed Jan 10 18:00 CST 2018"), "status":"PLAN", "task":"Get Coffee"},
		{"name": "AJ", "startTime":new Date("Wed Jan 10 7:15 CST 2018"), "endTime": new Date("Wed Jan 10 10:00 CST 2018"), "status":"PLAN", "task":"Get Coffee"},
		{"name": "Nina", "startTime":new Date("Wed Jan 10 7:15 CST 2018"), "endTime": new Date("Wed Jan 10 9:45 CST 2018"), "status":"PLAN", "task":"Get Coffee"},
        {"name": "AJ", "startTime":new Date("Wed Jan 10 18:00 CST 2018"), "endTime": new Date("Thu Jan 11 1:30 CST 2018"), "status":"PLAN", "task":"Get Coffee"},
        {"name": "Nina", "startTime":new Date("Wed Jan 10 18:30 CST 2018"), "endTime": new Date("Thu Jan 11 6:00 CST 2018"), "status":"PLAN", "task":"Get Coffee"}
	];

	var actualData = [
		{"name":"Brian", "startTime":new Date("Wed Jan 10 9:00 CST 2018"), "endTime": new Date("Wed Jan 10 16:00 CST 2018"), "status":"MAINTENANCE", "task":"Get Coffee"},
		{"name": "AJ", "startTime":new Date("Wed Jan 10 7:45 CST 2018"), "endTime": new Date("Wed Jan 10 10:00 CST 2018"), "status":"JAMMED", "task":"Get Coffee"},
		{"name": "Nina", "startTime":new Date("Wed Jan 10 9:30 CST 2018"), "endTime": new Date("Wed Jan 10 11:45 CST 2018"), "status":"JAMMED", "task":"Get Coffee"},
        {"name": "AJ", "startTime":new Date("Wed Jan 10 17:45 CST 2018"), "endTime": new Date("Thu Jan 11 1:00 CST 2018"), "status":"RUNNING", "task":"Get Coffee"},
        {"name": "Nina", "startTime":new Date("Wed Jan 10 18:30 CST 2018"), "endTime": new Date("Thu Jan 11 6:00 CST 2018"), "status":"RUNNING", "task":"Get Coffee"}
	];
    
	var taskStatus = {
        "PLAN" : "black",
        "NOT_STARTED" : "black",
        "JAMMED" : "red",
        "RUNNING" : "green",
        "MAINTENANCE" : "gold"
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
		//var gantt = d3.gantt().taskNames(tasknames).taskTypes(tasktypes).taskStatus(taskStatus).width(800).height(450);
		var gantt = d3.gantt().taskNames(tasknames).taskStatus(taskStatus).width(800).height(450);
		gantt(planData, actualData);
		
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
		return d.name + d.startTime + d.endTime;
	}
	
	var rectTransform = function(d) {
		return "translate(" + x(d.startTime) + "," + y(d.name) + ")";
	};

	
	var x,y,xAxis,yAxis, yAxisLines;
	
	// blah
	initAxis();
	
	var initTimeDomain = function() {
		/* todo current data starting at 7 ending at 7 am next day? */
		timeDomainStart = start;
		timeDomainEnd = end;
	}
	
	
	 function initAxis() {
		 // pick date here
		 
		x = d3.scaleTime().domain([ start, end ]).range([ 0, width ]).clamp(true);

		 // domain =
		y = d3.scaleBand().domain(taskNames)
	 		.range([ 0, height - margin.top - margin.bottom ]).padding(0.1);

		 // todo, lines like in the picture
        yLines = d3.scaleBand().domain(taskNames).range([0, height - margin.top - margin.bottom+30]).padding(0.1);

		xAxis = d3.axisBottom().scale(x).tickFormat(d3.timeFormat(tickFormat))
		  .ticks(24);

		yAxis = d3.axisLeft().scale(y).tickSize(0);

       // yAxisLines = d3.axisLeft().scale(yLines).tickSize(-width).tickFormat("");
	  }
	  
	  function gantt(plan, actual) {
		  
		  initTimeDomain();
		  initAxis();
          var yOffset = 30;
          var yPadding = 40;
		  
		  var svg = d3.select("body").selectAll("svg")
			.attr("class", "chart")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.append("g")
			.attr("class", "gantt-chart")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

			svg.selectAll(".chart-plan")
			.data(plan, keyFunction)
				.enter()
			.append("rect")
			.attr("rx", 5)
			.attr("ry", 5)
			.style("fill", function(d) {
				return taskStatus[d.status];
			})
			.attr("y", yOffset)
			.attr("transform", rectTransform)
			.attr("height", function(d) { return 20; })
			.attr("width", function(d) {
				return  (x(d.endTime) - x(d.startTime));
			})

		  	svg.selectAll(".chart-actual")
			.data(actual, keyFunction).enter()
			.append("rect")
			.attr("rx", 5)
			.attr("ry", 5)
			.style("fill", function(d) {
				return taskStatus[d.status];
			})
			// move 'actual' bars down
			.attr("y", yOffset+yPadding)
			.attr("transform", function(d) {
				return "translate(" + x(d.startTime) + "," + y(d.name) + ")"
			})
                // actual chart is 10px thicker
			.attr("height", function(d) { return 30; })
			.attr("width", function(d) {
				return (x(d.endTime) - x(d.startTime));
			});


         // var setBarText = function(className, data) {
              //
          var yTextPadding = yOffset + 13;//20;
          svg.selectAll(".plan-bar-text")
              .data(plan)
              .enter()
              .append("text")
              .attr("class", "bartext")
              .attr("text-anchor", "middle")
              .attr("fill", "white")
              .attr("x", function(d) {
                  console.log(d);
                  return x(d.startTime) + ((x(d.endTime) - x(d.startTime))/2);
              })
              .attr("y", function(d) {
                  return y(d.name)+yTextPadding;
                  //       return height-y(d)+yTextPadding;
              })
              .text(function(d){
                  // check if width is long enough for d.task in px
                  return d.task;
              });


          yTextPadding = yOffset + 17;
          svg.selectAll(".actual-bar-text")
              .data(actual)
              .enter()
              .append("text")
              .attr("class", "bartext")
              .attr("text-anchor", "middle")
              .attr("fill", "white")
              .attr("x", function(d) {
                  return x(d.startTime) + ((x(d.endTime) - x(d.startTime))/2);
              })
              .attr("y", function(d) {
                  return y(d.name)+yTextPadding+yPadding;
                  //       return height-y(d)+yTextPadding;
              })
              .text(function(d){
                  // check if width is long enough for d.task in px
                  return d.task;
              });
          // no x,y needed I think
          //setBarText(".plan-bar-text");
         // setBarText(".actual-bar-text");


		  	svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0, " + (height - margin.top - margin.bottom) + ")")
			.transition()
			.call(xAxis);

			svg.append("g").attr("class", "y axis").transition().call(yAxis);
           // svg.append("g").attr("class", "y axis lines").transition().call(yAxisLines);

			return gantt;
	  }

	  var setBarText = function(svg, className, data, x, y) {
          //
          var yTextPadding = 20;
          svg.selectAll(className)
              .data(data)
              .enter()
              .append("text")
              .attr("class", "bartext")
              .attr("text-anchor", "middle")
              .attr("fill", "black")
              .attr("x", function(d, i) {
                  return x(d.startTime) + (x(d.endTime - d.startTime) / 2);
              })
              .attr("y", function(d,i) {
                  return height-y(d)+yTextPadding;
                  //       return height-y(d)+yTextPadding;
              })
              .text(function(d){
                  return d.task;
              });
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



		
