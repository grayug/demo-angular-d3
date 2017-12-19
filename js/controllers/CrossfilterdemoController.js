app.controller('CrossfilterdemoController', ['$scope', 'barFactory', function($scope, barFactory){
	
	// TODO refactor this

	
	$scope.crossfilterdemoInit = function() {
		
		
		var colorResult;
		var alphabetResult;
		var colorAlphaResult;
		
		var alphabetDimension;
		var colorDimension;
		
		function init(data) {
			var data = data.data;
			  
			var cf = crossfilter(data);
			  
			colorDimension = cf.dimension(function(p) { return p.category1 });

			 
			 /*
			groupByColor.top(Infinity).forEach(function(p, i) {
				
				console.log(p.key + ": " + p.value);
				
				byColor.filterExact(p.key);
				
				byColor.top(Infinity).forEach(function(d, k) {
					console.log(d.category1 + " : " + d.value);
				});
			}); */
			 
			 
			
			colorResult = colorDimension.group().reduce(reduceAdd, reduceRemove, reduceInitial).all();
		
			
			// Do for alphabet
			 
			alphabetDimension = cf.dimension(function(p) { return p.category2 });
			
			alphabetResult = alphabetDimension.group().reduce(reduceAdd, reduceRemove, reduceInitial).all();
			
	
			// reduce on 2 dimension
			var colorAlpha = cf.dimension(function(p) { return p.category1 + "/" + p.category2; });
			
			colorAlphaResult = colorAlpha.group().reduce(reduceAdd, reduceRemove, reduceInitial).all();
			
			

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
		
			var margin = {
				top: 15,
				right: 25,
				bottom: 15,
				left: 60
			};
			
			var width = 960 - margin.left - margin.right;
			var height = 500 - margin.top - margin.bottom;
			
			
			// get max X
			var domainMax = d3.max(dataset, function(d) {
				return d.value;
			});
			// round to nearest 50
			var domainMax = Math.ceil(domainMax / 50) * 50;
			
				
			var xScale = d3.scaleLinear()
				.range([0, width])
				.domain([0, domainMax]);

			var yScale = d3.scaleBand()
				.rangeRound([height, 0])
				.domain(dataset.map(function (d) {
					return d.key;
				}));
				
			
			// get empty chart
			var svg = barFactory.drawBarChart(id, margin, width, height, xScale, yScale);
			
			
			// clean data for d3
			var cleanedDataset = [];
			var categories = [];
			for(i = 0; i < dataset.length; i++){
				categories.push(dataset[i].key);
				cleanedDataset.push(dataset[i].value);
				console.log("Sum of values at " + dataset[i].key + ": " + dataset[i].value);
			}
			
			// draw bars
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
				.style("fill", "black")
				.attr("width", function (d, i) {
					return xScale(cleanedDataset[i]);
				})
				.on('click', function(d,i) {
					svg.selectAll("rect.bar").style("fill", "grey");
					d3.select(this).style("fill", "black");
				
					// terrible name
					var dataset2 = [];
			
					
					var idToSelect;
					
					// selected colors, so we want to select alpha
					
					// really bad hardcode/hack for filtering, working on fixing this rn!
					if(id === "#test") {
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
					
					}
					
					
					// reset current selected chart
					d3.select(id).selectAll("svg").selectAll("rect.bar").data(cleanedDataset).transition().duration(1000).attr("width", function(d) { return xScale(d); });
					
					// set other chart's data to volume of selected bar
					d3.select(idToSelect).selectAll("svg").selectAll("rect.bar").style("fill", "black").data(dataset2).transition().duration(1000).attr("width", function(d) { return xScale(d); });
			});
			
		}
		
		d3.json("dataCat.json", function(error, data) {
		  if (error) throw error;
		  
		  
		  init(data);
		  
		  // draw
		  draw(colorResult, "#test");
		  draw(alphabetResult, "#test2");
		});
	}
		
	}]);