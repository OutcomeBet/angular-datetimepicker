(function(window) {
	if(!('moment' in window)) {
		return console.error("Moment.js is missing.");
	}

	$.datetimepicker.setDateFormatter({
		parseDate: function(date, format) {
			var d = moment(date, format);
			return d.isValid() ? d.toDate() : false;
		},
		formatDate: function(date, format) {
			return moment(date).format(format);
		}
	});

	var m = angular.module('datetimePicker', []);

	m.constant('datetimePickerConfig', {
		translations: {
			none: 'None',
			today: 'Today',
			yesterday: 'Yesterday',
			lastWeek: 'Last week',
			lastMonth: 'Last month'
		}
	});

	m.directive('datetimePicker', function() {
		return {
			restrict: 'A',
			require: '?ngModel',
			link: function($scope, $el, attrs, ngModel) {

				var format = attrs.unixtime || 'YYYY/MM/DD HH:mm',
					formatDate = 'YYYY/MM/DD',
					formatTime = 'HH:mm';

				$el.datetimepicker({
					format: format,
					formatDate: formatDate,
					formatTime: formatTime
				});

				if(ngModel) {
					ngModel.$parsers.push(function(value) {
						if(typeof value === 'undefined') return value;
						return ngModel.$isEmpty(value) ? null : value;
					});
				}
			}
		};
	});

	m.directive('datetimeRangePicker', ['datetimePickerConfig', function(datetimePickerConfig) {
		return {
			restrict: 'E',
			scope: {
				datetimeRangePicker: '='
			},
			template: '<input datetime-picker unixtime ng-model="datetimeRangePicker.start">&nbsp;-&nbsp;<input datetime-picker unixtime ng-model="datetimeRangePicker.end">' +
				'&nbsp;&nbsp;<select ng-model="model.range" ng-options="interval.title for interval in intervals"></select>',
			controller: ['$scope', function($scope) {
				$scope.intervals = [
					{title: datetimePickerConfig.translations.today, start: moment().startOf('day').unix(), end: moment().endOf('day').unix()},
					{title: datetimePickerConfig.translations.yesterday, start: moment().subtract(1, 'days').startOf('day').unix(), end: moment().subtract(1, 'days').endOf('day').unix()},
					{title: datetimePickerConfig.translations.lastWeek, start: moment().subtract(1, 'weeks').startOf('day').unix(), end: moment().unix()},
					{title: datetimePickerConfig.translations.lastMonth, start: moment().subtract(1, 'months').startOf('month').unix(), end: moment().subtract(1, 'months').endOf('month').unix()}
				];

				$scope.model = {
					range: $scope.intervals[0],
				};

				$scope.$watch('model.range', function(range) {
					if(!$scope.datetimeRangePicker) {
						$scope.datetimeRangePicker = {};
					}
					$scope.datetimeRangePicker.start = range.start;
					$scope.datetimeRangePicker.end = range.end;
				});
			}]
		};
	}]);

	m.directive('unixtime', function() {
		return {
			require: '?ngModel',
			restrict: 'A',
			link: function($scope, $el, attrs, ngModel) {
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
})(window);
