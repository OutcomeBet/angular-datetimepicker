(function() {
	var demo = angular.module('demo', ['datetimePicker']);
	demo.controller('Demo1Ctrl', function($scope) {
		$scope.model = {
			timestamp: 1402292961
		};
	});
	demo.controller('Demo2Ctrl', function($scope) {
		$scope.model = {
			range: {
				start: 1402292961 - 100000,
				end: 1402292961 + 100000
			}
		};
	});
})();
