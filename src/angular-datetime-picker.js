(function(){
	var m = angular.module('datetimePicker', []);

	m.directive('datetimePicker', function(){

		Date.parseDate = function(input, format){
			return moment(input, format).toDate();
		};

		Date.prototype.dateFormat = function(format){
			return moment(this).format(format);
		};

		return {
			restrict: 'A',
			link: function(scope, element, attrs, ngModel){

				var format = attrs.unixtime || 'YYYY/MM/DD HH:mm',
					formatDate = 'YYYY/MM/DD',
					formatTime = 'HH:mm';

				element.datetimepicker({
					format: format,
					formatDate: formatDate,
					formatTime: formatTime
				});
			}
		};
	});

	m.directive('datetimeRangePicker', function(){
		return {
			restrict: 'E',
			scope: {
				datetimeRangePicker: '='
			},
			template: '<input datetime-picker unixtime ng-model="datetimeRangePicker.from"> - <input datetime-picker unixtime ng-model="datetimeRangePicker.to">'
		};
	});

	m.directive('unixtime', function(){
		return {
			require: '?ngModel',
			restrict: 'A',
			link: function(scope, element, attrs, ngModel){

				var format = attrs.unixtime || 'YYYY/MM/DD HH:mm';

				ngModel.$formatters.push(function(value){
					return moment.unix(value).format(format);
				});

				ngModel.$parsers.push(function(value){
					return moment(value, format).unix();
				});
			}
		};
	});
})();