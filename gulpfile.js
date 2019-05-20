const { src, dest, parallel } = require('gulp');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const ngAnnotate = require('gulp-ng-annotate');

function compress() {
	return src(['src/angular-datetimepicker.js'])
		.pipe(babel({presets: ['env']}))
		.pipe(ngAnnotate())
		.pipe(uglify())
		.pipe(rename('angular-datetimepicker.min.js'))
		.pipe(dest('dist'));
}

exports.compress = compress;
exports.default = parallel(compress);
