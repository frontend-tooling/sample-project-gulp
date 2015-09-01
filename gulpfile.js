var gulp        = require('gulp');
var jshint      = require('gulp-jshint');
var uglify      = require('gulp-uglify');
var concat      = require('gulp-concat');
var less        = require('gulp-less');
var minifyCSS   = require('gulp-minify-css');
var prefix      = require('gulp-autoprefixer');

var del         = require('del');
var bSync       = require('browser-sync');
var wiredep     = require('wiredep').stream;
var mainBowerFiles = require('main-bower-files');

var cached      = require('gulp-cached');
var remember    = require('gulp-remember');
var sourcemaps  = require('gulp-sourcemaps');
var combiner    = require('stream-combiner2');
var through     = require('through2');

var isprod = false;

var noop = function() {
    return through.obj();
};

var dev = function(task) {
    return isprod ? noop() : task;
};

var prod = function(task) {
    return isprod ? task : noop();
};

gulp.task('test', function() {
  return gulp.src(['app/scripts/**/*.js', '!app/scripts/vendor/**/*.js'])
    .pipe(cached('hint'))
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('fail'));
});

gulp.task('scripts',
  gulp.series('test', function scriptsInternal() {
    var glob = mainBowerFiles('**/*.js');
    glob.push('app/scripts/**/*.js');
    return gulp.src(glob)
      .pipe(sourcemaps.init())
      //.pipe(cached('ugly'))
      .pipe(uglify())
      //.pipe(remember('ugly'))
      .pipe(concat('main.min.js'))
      .pipe(sourcemaps.write())
      .pipe(gulp.dest('dist/scripts'));
  })
);

gulp.task('styles', function() {
  return gulp.src('app/styles/main.less')
    .pipe(sourcemaps.init())
    .pipe(less())
    .pipe(minifyCSS())
    .pipe(prefix())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist/styles'));
});

gulp.task('clean', function(done) {
  del(['dist'], done);
});

gulp.task('server', function(done) {
  bSync({
    server: {
      baseDir: ['dist', 'app']
    }
  })
  done();
});

var wiredep  = require('wiredep').stream;

gulp.task('deps', function() {
  return gulp.src('app/**/*.html')
    .pipe(wiredep())
    .pipe(gulp.dest('dist'));
});

gulp.task('default',
  gulp.series('clean',
  gulp.parallel('styles', 'scripts'),
  'server',
  function watcher(done) {
    gulp.watch(['app/scripts/**/*.js', '!app/scripts/vendor/**/*.js'], gulp.parallel('scripts'));
    gulp.watch('app/styles/**/*.less', gulp.parallel('styles'));
    gulp.watch('dist/**/*', bSync.reload);
  })
);
