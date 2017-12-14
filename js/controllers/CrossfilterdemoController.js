app.controller('CrossfilterdemoController', ['$scope', function($scope){
	
	// TODO refactor this

	
	$scope.crossfilterdemoInit = function() {
		
		
		function draw(data) {
			
			var data = data.data;
			
			/* data.forEach(function(d) {
			 // d.category1 = +category1;
			  //d.category2 = +category2;
			  d.value = +d.value;
			}) */
			  
			 var cf = crossfilter(data);
			  
			 var byColor = cf.dimension(function(p) { return p.category1 });

			 
			 /*
			groupByColor.top(Infinity).forEach(function(p, i) {
				
				console.log(p.key + ": " + p.value);
				
				byColor.filterExact(p.key);
				
				byColor.top(Infinity).forEach(function(d, k) {
					console.log(d.category1 + " : " + d.value);
				});
			}); */
			 
			 
			
			var array = byColor.group().reduce(reduceAdd, reduceRemove, reduceInitial).all();
			
			for(i = 0; i < array.length;
			console.log("Sum " + array[0].key + ": " + array[0].value);
			console.log("Sum " + array[0].key + ": " + array[1].value);
			console.log("Sum " + array[0].key + ": " + array[2].value);
			 
			 
			var byAlphabet = cf.dimension(function(p) { return p.category2 });

			function reduceAdd(p, v) {
				return p + v.value;
			}
			
			function reduceRemove(p, v) {
				return p - v.value;
			}
			
			function reduceInitial() {
				return 0;
			}

			
			
			// stuff to remove after 
			var w = 500;
			var h = 100;
			var dataset = [ 5, 10, 15, 20, 25 ];
			var barPadding = 1;
			
			
			var colorDataset = []
			for(i = 0; i < array.length; i++){
				colorDataset.push(array[i].value);
				console.log("111 val = " + array[i].value);
			}
			
			
			/*
				TODO: Add alphabet reduced result to array, then add here
			var alphabetDataset = []
			for(i = 0; i < array.length; i++){
				colorDataset.push(array[i].value);
			} */
			
			
			// (d3 placeholder code)
			//var dataset = [ 5, 10, 13, 19, 21, 25, 22, 18, 15, 13,
			//				11, 12, 15, 20, 18, 17, 16, 18, 23, 25 ];
						
			//Create SVG element
			
			// TODO chart
			var svg = d3.selectAll("body")
				.selectAll("svg")
				.attr("width", w)
				.attr("height", h);

			svg.selectAll("rect")
			   .data(colorDataset) 
			   .enter()
			   .append("rect")
			   .attr("x", function(d, i) {
			   return i * (w / colorDataset.length);
			})
			.attr("y", function(d) {
				   return h - (d * 4);
		   })
		   .attr("width", w / colorDataset.length - barPadding)
		   .attr("height", function(d) {
				   return d * 4;
		   })
		   .attr("fill", function(d) {
				return "rgb(0, 0, " + (d * 10) + ")";
		   });
			}

		
		
		
		d3.json("dataCat.json", function(error, data) {
		  if (error) throw error;
		  
		  // trigger render
		  draw(data);
		});
	}
		
	}]);