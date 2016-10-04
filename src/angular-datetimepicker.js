(function() {
	var m = angular.module('datetimePicker', []);

	m.directive('datetimePicker', function() {
		Date.parseDate = function(input, format) {
			return moment(input, format).toDate();
		};

		Date.prototype.dateFormat = function(format) {
			return moment(this).format(format);
		};

		return {
			restrict: 'A',
			require: '?ngModel',
			link: function(scope, element, attrs, ngModel) {

				var format = attrs.unixtime || 'YYYY/MM/DD HH:mm',
					formatDate = 'YYYY/MM/DD',
					formatTime = 'HH:mm';

				element.datetimepicker({
					format: format,
					formatDate: formatDate,
					formatTime: formatTime
				});

				if(ngModel)
					ngModel.$parsers.push(function(value) {
						if(typeof value === 'undefined') return value;
						return ngModel.$isEmpty(value) ? null : value;
					});
			}
		};
	});

	m.directive('datetimeRangePicker', function() {
		return {
			restrict: 'E',
			scope: {
				datetimeRangePicker: '='
			},
			template: '<input datetime-picker unixtime ng-model="datetimeRangePicker.start">&nbsp;-&nbsp;<input datetime-picker unixtime ng-model="datetimeRangePicker.end">' +
				'&nbsp;&nbsp;<select ng-model="model.range" ng-options="interval.title for interval in intervals"></select>',
			controller: ['$scope', function($scope) {
				$scope.intervals = [
					{ title: 'Today', start: moment().startOf('day').unix(), end: moment().endOf('day').unix() },
					{ title: 'Yesterday', start: moment().subtract('days', 1).startOf('day').unix(), end: moment().subtract('days', 1).endOf('day').unix() },
					{ title: 'Last week', start: moment().subtract('weeks', 1).startOf('day').unix(), end: moment().unix() },
					{ title: 'Last month', start: moment().subtract('months', 1).startOf('month').unix(), end: moment().subtract('months', 1).endOf('month').unix() }
				];
				$scope.$watch('model.range', function(range) {
					if(range && (range.start || range.end)) {
						if(!$scope.datetimeRangePicker) {
							$scope.datetimeRangePicker = {};
						}
						$scope.datetimeRangePicker.start = range.start;
						$scope.datetimeRangePicker.end = range.end;
					}
				});
			}]
		};
	});

	m.directive('unixtime', function() {
		return {
			require: '?ngModel',
			restrict: 'A',
			link: function(scope, element, attrs, ngModel) {
				var format = attrs.unixtime || 'YYYY/MM/DD HH:mm';

				ngModel.$formatters.push(function(value) {
					if(!value) return value;
					return moment.unix(value).format(format);
				});

				ngModel.$parsers.push(function(value) {
					if(!value) return value;
					return moment(value, format).unix();
				});
			}
		};
	});
})();
