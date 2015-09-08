'use strict';

var gulp = require('gulp');

var less = function(dest, isProduction) {
    var gulp = require('gulp');
    var less = require('gulp-less');
    var prefix = require('gulp-autoprefixer');
    var rename = require('gulp-rename');
    var sourcemap = require('gulp-sourcemaps');

    return gulp.src('src/angular-json-pretty.less')
        .pipe(sourcemap.init())
        .pipe(less({
            compress: isProduction
        }))
        .pipe(sourcemap.write())
        .pipe(prefix({
            browsers: ['last 5 versions'],
            cascade: true
        }))
        .pipe(rename({
            basename: isProduction ? 'angular-json-pretty.min' : 'angular-json-pretty'
        }))
        .pipe(gulp.dest(dest));
};

var bundle = function(dest, isProduction) {
    var browserify = require('browserify');
    var gulp = require('gulp');
    var gutil = require('gulp-util');
    var rename = require('gulp-rename');
    var uglify = require('gulp-uglify');
    var sourcemaps = require('gulp-sourcemaps');
    var source = require('vinyl-source-stream');
    var buffer = require('vinyl-buffer');

    var b= browserify({
        entries: './src/JSONbig.js',
        debug: !isProduction
    });

    return b.bundle()
        .pipe(source('JSONbig.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(uglify())
            .on('error', gutil.log)
        .pipe(sourcemaps.write())
        //.pipe(rename({
        //    basename: 'JSONbig-min'
        //}))
        .pipe(gulp.dest(dest));
}

gulp.task('lessDemo', function() {
    return less('demo/', false);
});

gulp.task('lessDist', function() {
    return less('dist/', true);
});

gulp.task('copyDemo', function() {
    return gulp.src('src/angular-json-pretty.js')
        .pipe(gulp.dest('demo/'));
});

gulp.task('copyDist', function() {
    return gulp.src('./src/angular-json-pretty.js')
        .pipe(gulp.dest('./dist/'));
});

gulp.task('bundleJsonbigDemo', function() {
    return bundle('demo/', false);
});

gulp.task('bundleJsonbigDist', function() {
    return bundle('dist/', true);
});

gulp.task('demo', ['lessDemo', 'copyDemo', 'bundleJsonbigDemo'], function() {
    var webserver = require('gulp-webserver');
    gulp.src('demo/')
        .pipe(webserver({
            host: '0.0.0.0',
            port: 8080,
            livereload: true,
            directoryListing: false,
            fallback: 'index.html'
        }));
});

gulp.task('dist', ['lessDist', 'copyDist', 'bundleJsonbigDist'], function() {
    var uglify = require('gulp-uglify');
    var sourcemaps = require('gulp-sourcemaps');
    var rename = require('gulp-rename');

    return gulp.src('./dist/angular-json-pretty.js')
        .pipe(sourcemaps.init())
        .pipe(rename({
            basename: 'angular-json-pretty.min'
        }))
        .pipe(uglify())
        .pipe(sourcemaps.write('./', {
            sourceRoot: '.'
        }))
        .pipe(gulp.dest('./dist/'));
});

