'use strict';

var gulp = require('gulp');
var connect = require('gulp-connect'); //runs a local dev server
var open = require('gulp-open'); //opens a URL in a web browser
var browserify = require('browserify'); //Bundles JS files
var reactify = require('reactify'); //Transpiles JSX to JS
var source = require('vinyl-source-stream'); //Use conventional text streams with Gulp 
var concat = require('gulp-concat'); // Concatinates files
var eslint = require('gulp-eslint'); //lints JS files and JSX

var config = {
    port: 9005,
    devBaseUrl: 'http://localhost',
    paths: {
        html: './src/*.html',
        js: './src/**/*.js',
        css: [
            'node_modules/bootstrap/dist/css/bootstrap.min.css',
            'node_modules/bootstrap/dist/css/bootstrap-theme.min.css'
        ],
        build: './build',
        mainJs: './src/main.js'
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

gulp.task('js', function(){
    browserify(config.paths.mainJs)
        .transform(reactify)
        .bundle()
        .on('error', console.error.bind(console))
        .pipe(source('bundle.js'))
        .pipe(gulp.dest(config.paths.build + '/scripts'))
        .pipe(connect.reload());
}); 
    
gulp.task('css', function(){      
    gulp.src(config.paths.css)
        .pipe(concat('bundle.css'))
        .pipe(gulp.dest(config.paths.build + '/css'));
});

gulp.task('watch', function () {
    gulp.watch(config.paths.html, ['html']);
    gulp.watch(config.paths.js, ['js', 'lint']);
});

gulp.task('default', ['html', 'js', 'css', 'lint', 'open', 'watch']);

gulp.task('lint', function(){
    return gulp.src(config.paths.js)
        .pipe(eslint({
            config: '.eslintrc.json'
        }))
        .pipe(eslint.format());
});

