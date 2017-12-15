var app = angular.module("demoApp", ['ngMaterial', 'ngRoute']);


app.config(function ($routeProvider) {
	// 'unselected' or 'base' html for demo-web-app/ or demo-web-app/#/ URLs? So we don't get the htdocs MAMP directory
	$routeProvider
		.when('/', {
			templateUrl: 'views/product.html'
		})
		.when('/contact', {
			controller: 'ContactController',
			templateUrl: 'views/contact.html'
			
		})
		.when('/product', {
			controller: 'ProductController',
			templateUrl: 'views/product.html'
		})
		.when('/linechart', {
			controller: 'LinechartController',
			templateUrl: 'views/linechart.html'
		})
		.when('/crossfilterdemo', {
			controller: 'CrossfilterdemoController',
			templateUrl: 'views/crossfilterdemo.html'
		})
		.otherwise({
			redirectTo: 'views/product.html'
		});
});
