var gulp        = require('gulp');
var jshint      = require('gulp-jshint');
var uglify      = require('gulp-uglify');
var concat      = require('gulp-concat');
var less        = require('gulp-less');
var minifyCSS   = require('gulp-minify-css');
var prefix      = require('gulp-autoprefixer');

gulp.task('test', function() {
  return gulp.src(['app/scripts/**/*.js', '!app/scripts/vendor/**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('fail'));
});


gulp.task('scripts',
  gulp.series('test', function scriptsInternal() {
    return gulp.src(['app/scripts/**/*.js', '!app/scripts/vendor/**/*.js'])
      .pipe(concat('main.min.js'))
      .pipe(uglify())
      .pipe(gulp.dest('dist/scripts'));
  })
);

gulp.task('styles', function() {
  return gulp.src('app/styles/main.less')
    .pipe(less())
    .pipe(minifyCSS())
    .pipe(prefix())
    .pipe(gulp.dest('dist/styles'));
});
