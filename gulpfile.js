'use strict';

var gulp = require('gulp');
//runs a local dev server
var connect = require('gulp-connect');
//opens a URL in a web browser
var open = require('gulp-open');

var config = {
    port: 9005,
    devBaseUrl: 'http://localhost',
    paths: {
        html: './src/*.html',
        build: './build'
    }
};

//Start a local dev server
gulp.task('connect', function () {
    connect.server({
        root: ['build'],
        port: config.port,
        base: config.devBaseUrl,
        livereload: true
    });
});

gulp.task('open', ['connect'], function () {
    gulp.src('build/index.html')
        .pipe(open({
            uri: config.devBaseUrl + ':' + config.port + '/',
            app: 'chrome'
        }));
});

gulp.task('html', function () {
    gulp.src(config.paths.html)
        .pipe(gulp.dest(config.paths.build))
        .pipe(connect.reload());
});

gulp.task('watch', function () {
    gulp.watch(config.paths.html, ['html']);
});

gulp.task('default', ['html', 'open', 'watch']);

