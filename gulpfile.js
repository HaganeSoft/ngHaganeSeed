var gulp = require('gulp');
var svgng = require('gulp-svg-ngmaterial');
var svgmin = require('gulp-svgmin');
var path = require('path');
var concat = require('gulp-concat');

gulp.task('svgstore', function () {
    return gulp
        .src('img/exposicion/*.svg')
        .pipe(svgmin(function (file) {
            var prefix = path.basename(file.relative, path.extname(file.relative));
            return {
                plugins: [{
                    cleanupIDs: {
                        prefix: prefix + '-',
                        minify: true
                    }
                }]
            }
        }))
        .pipe(svgng({removeViewBox : true}))
        .pipe(gulp.dest('public_html/font/exposicion'));
});

gulp.task('build', function() {
	gulp.src(['app/app.js','app/**/*.js'])
		.pipe(concat('app.js'))
		.pipe(gulp.dest('dist'));
});

gulp.task('default', ['build'], function() {
	gulp.watch('app/**/*.js', ['build']);
});
