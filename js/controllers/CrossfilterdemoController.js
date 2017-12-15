app.controller('CrossfilterdemoController', ['$scope', function($scope){
	
	// TODO refactor this

	
	$scope.crossfilterdemoInit = function() {
		
		
		var colorResult;
		var alphabetResult;
		
		function init(data) {
			var data = data.data;
			
			/* data.forEach(function(d) {
			 // d.category1 = +category1;
			  //d.category2 = +category2;
			  d.value = +d.value;
			}) */
			  
			 var cf = crossfilter(data);
			  
			 var color = cf.dimension(function(p) { return p.category1 });

			 
			 /*
			groupByColor.top(Infinity).forEach(function(p, i) {
				
				console.log(p.key + ": " + p.value);
				
				byColor.filterExact(p.key);
				
				byColor.top(Infinity).forEach(function(d, k) {
					console.log(d.category1 + " : " + d.value);
				});
			}); */
			 
			 
			
			colorResult = color.group().reduce(reduceAdd, reduceRemove, reduceInitial).all();
			
			/*for(i = 0; i < array.length; i++) {
				console.log("Sum of values at color " + array[i].key + ": " + array[i].value);
			}*/
			
			// Do for alphabet
			 
			var alphabet = cf.dimension(function(p) { return p.category2 });
			
			alphabetResult = alphabet.group().reduce(reduceAdd, reduceRemove, reduceInitial).all();

			function reduceAdd(p, v) {
				return p + v.value;
			}
			
			function reduceRemove(p, v) {
				return p - v.value;
			}
			
			function reduceInitial() {
				return 0;
			}
			
		}
		
		function draw(dataset, id) {	
			
			var barPadding = 1;
			
			
			// clean dataset for d3
			var cleanedDataset = [];
			var categories = [];
			for(i = 0; i < dataset.length; i++){
				categories.push(dataset[i].key);
				cleanedDataset.push(dataset[i].value);
				console.log("Sum of values at " + dataset[i].key + ": " + dataset[i].value);
			}
			

			//set up svg using margin conventions - we'll need plenty of room on the left for labels
			// adapting from https://bl.ocks.org/hrecht/f84012ee860cb4da66331f18d588eee3
			// and http://bl.ocks.org/kiranml1/6872226
			
			var margin = {
				top: 15,
				right: 25,
				bottom: 15,
				left: 60
			};
			

			var width = 960 - margin.left - margin.right;
			var height = 500 - margin.top - margin.bottom;
				
				
			var numTicks = 6;
			var grid = d3.range(numTicks).map(function(i){
				return {'x1':0,'y1':0,'x2':0,'y2':500 - margin.top - margin.bottom};
			});

			var tickVals = grid.map(function(d,i){
				if(i>0){ return i*50; }
				else if(i===0){ return "100";}
			});
				
				
			var svg = d3.select(id).selectAll("svg")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom)
				.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
				
				
			// get max X
			var domainMax = d3.max(dataset, function(d) {
				return d.value;
			});
			var domainMax = Math.ceil(domainMax / 50) * 50;
			
			var tickSkip = (960 + margin.left + margin.right) / numTicks;
			
			// grid lines for ticks
			var grids = svg.append('g')
					  .attr('id','grid')
					  //.attr('transform','translate(0,-10)')
					  .selectAll('line')
					  .data(grid)
					  .enter()
					  .append('line')
					  .attr('x1', function(d, i) { return i * tickSkip; })
					  .attr('y1', function(d){ return d.y1; })
					  .attr('x2', function(d,i){ return i*tickSkip; })
					  .attr('y2', function(d){ return d.y2; })
					  .style('stroke', '#adadad')
					  .style('stroke-width', '1px');
					  

			var xScale = d3.scaleLinear()
				.range([0, width])
				// TODO range should round to nearest 50 instead of static
				.domain([0, domainMax]);

			var yScale = d3.scaleBand()
				.rangeRound([height, 0])
				.domain(dataset.map(function (d) {
					return d.key;
				}));


			var yAxis = d3.axisLeft(yScale).tickSize(0);
			
			var xAxis = d3.axisBottom(xScale).tickSize(1).tickValues(tickVals);

			var gy = svg.append("g")
				.attr("class", "yaxis")
				.call(yAxis);
				
			var gx = svg.append("g")
					 .attr("class", "xaxis")
					 .attr("transform", "translate(0,470)")
					 .call(xAxis);

			var bars = svg.selectAll(".bar")
				.data(cleanedDataset)
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
				.attr("width", function (d, i) {
					return xScale(cleanedDataset[i]);
				});

			//add a value label to the right of each bar
			bars.append("text")
				.attr("class", "label")
				//y position of the label is halfway down the bar
				.attr("y", function (d, i) {
					return yScale(categories[i]);
				})
				//x position is 3 pixels to the right of the bar
				.attr("x", function (d, i) {
					return xScale(cleanedDataset[i]) + 3;
				})
				.text(function (d, i) {
					return d[i];
				});
		}
		
		d3.json("dataCat.json", function(error, data) {
		  if (error) throw error;
		  
		  
		  init(data);
		  
		  // trigger render
		  draw(colorResult, "#test");
		  draw(alphabetResult, "#test2");
		});
	}
		
	}]);