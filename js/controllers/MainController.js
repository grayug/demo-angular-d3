app.controller('MainController', ['$scope', function($scope) {
	
	$scope.currentNavItem = 'Products';
	
	$scope.goto = function(page) {
		console.log("Goto " + page);
	}
	
	$scope.tabs = [
		{
			name: 'Content',
			content: 'content '
		},
		{
			name: 'Review',
			content: 'blah'
		}
	]
}]);



/*

	similar content tabs (as a reference)
	
	<div class="main" ng-controller="MainController">
	
		<md-content> 
			<md-tabs md-border-bottom>
				<md-tab ng-repeat="tab in tabs" label="{{tab.name}}">
					<md-tab-body>
						<p>{{ tab.content }}</p>
						<p> {{ dog }} </p>
						
						<md-input-container class="md-block" visibility="hidden">
							<label>Review</label>
							<textarea md-maxlength="150" rows="5" md-select-on-focus></textarea>
						</md-input-container>
					</md-tab-body>
				</md-tab>
				
			</md-tabs>
		
		</md-content>
	
	</div>
	
	*/