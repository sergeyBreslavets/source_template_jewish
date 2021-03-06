'use strict';

// include gulp
var gulp = require('gulp');
var pkg = require('./package.json');
// include plug-ins
var concat  = require('gulp-concat');
var rename = require('gulp-rename');
var sass    = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var autoprefix = require('gulp-autoprefixer');
var jshint = require('gulp-jshint');
var stripDebug = require('gulp-strip-debug');
var clean = require('gulp-clean');
var minifycss = require('gulp-minify-css');
var notify = require('gulp-notify');
var jade = require('gulp-jade');
var plumber = require('gulp-plumber');

var version     = pkg.version;
var name        = pkg.name;
var browsers    = pkg.browsers;

//src file
var source_images   = './src/images/**/*';
var source_js       = './src/scripts/*.js';
var source_sass     = './src/sass/styles.scss';
//var htmlSrc = './src/html/*.html';
//var srcjade        ='./src/jade/*.jade';


//custom destination
var destination         = '../catalog/view/theme/' + name + '/assets/';
var destination_css     = '../catalog/view/theme/' + name + '/assets/css/';
var destination_js      = '../catalog/view/theme/' + name + '/assets/js/';
var destination_fonts   = '../catalog/view/theme/' + name + '/assets/fonts/';
var destination_image   = '../catalog/view/theme/' + name + '/assets/css/img';

// tasks copy font-awesome 
gulp.task('copyfontawesome', function() {
    return gulp.src('./bower_components/font-awesome/fonts/*')
        .pipe(gulp.dest(destination_fonts+'font-awesome'));
});
// tasks copy font-glyphicon 
gulp.task('copyfontglyphicon', function() {
    return gulp.src('./bower_components/bootstrap-sass/assets/fonts/**/*')
    .pipe(gulp.dest(destination_fonts))
    .pipe(notify({
            title: 'copyfontglyphicon',
            message: 'copy - DONE!'
    }));
});
//clean task
gulp.task('clean', function() {
    return gulp.src(destination,{
            read:false
        })
        .pipe(clean({force: true}));
});

//sass task
gulp.task('sass', function() {
    gulp.src(source_sass)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass({
           errLogToConsole: true
        }).on('error', sass.logError))
       /* .pipe(autoprefix(
            'Android >= ' + browsers.android,
            'Chrome >= ' + browsers.chrome,
            'Firefox >= ' + browsers.firefox,
            'Explorer >= ' + browsers.ie,
            'iOS >= ' + browsers.ios,
            'Opera >= ' + browsers.opera,
            'Safari >= ' + browsers.safari
        ))*/
        .pipe(rename(name+'.css'))
        .pipe(gulp.dest(destination_css))
        .pipe(minifycss())
        .pipe(rename(name+'.min.css'))
        .pipe(sourcemaps.write())
        .pipe(notify({
            title: 'sass',
            message: 'DONE!'
        }))
        .pipe(gulp.dest(destination_css));
});
// JS concat, strip debugging and minify
var sourcesjs  = [
    './bower_components/modernizr/modernizr.js',
    './bower_components/jquery/dist/jquery.js',
    './bower_components/bootstrap-sass/assets/javascripts/bootstrap/transition.js',
    //'./bower_components/bootstrap-sass/assets/javascripts/bootstrap/alert.js',
    //'./bower_components/bootstrap-sass/assets/javascripts/bootstrap/button.js',
    //'./bower_components/bootstrap-sass/assets/javascripts/bootstrap/carousel.js',
    './bower_components/bootstrap-sass/assets/javascripts/bootstrap/collapse.js',
    './bower_components/bootstrap-sass/assets/javascripts/bootstrap/dropdown.js',
    './bower_components/bootstrap-sass/assets/javascripts/bootstrap/modal.js',
    //'./bower_components/bootstrap-sass/assets/javascripts/bootstrap/tooltip.js',
    //'./bower_components/bootstrap-sass/assets/javascripts/bootstrap/popover.js',
    //'./bower_components/bootstrap-sass/assets/javascripts/bootstrap/scrollspy.js',
    './bower_components/bootstrap-sass/assets/javascripts/bootstrap/tab.js',
    //'./bower_components/bootstrap-sass/assets/javascripts/bootstrap/affix.js', 
    'src/scripts/_visual.js',
    'src/scripts/_action.js',
    'src/scripts/_rival.js',
    'src/scripts/_common.js'
    
];
var custom_sourcesjs = [
    'src/scripts/_visual.js',
    'src/scripts/_action.js',
    'src/scripts/_rival.js',
    'src/scripts/_common.js'
];
gulp.task('scripts', function() {
    return gulp.src(sourcesjs)
        .pipe(plumber())
        .pipe(concat(name+'.js'))
        .pipe(gulp.dest(destination_js))
        .pipe(notify({
            title: 'scripts',
            message: 'concat - DONE!'
        }))
        .pipe(uglify())
        .pipe(rename(name+'.min.js'))
        .pipe(gulp.dest(destination_js))
        .pipe(notify({
            title: 'scripts',
            message: 'uglify - DONE!'
        }));
});
// JS hint task ???
gulp.task('jshint', function() {
    return gulp.src(custom_sourcesjs)
        .pipe(plumber())
        .pipe(stripDebug())
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

//jade task
//gulp.task('jade', function() {
//    gulp.src([srcjade])
//        .pipe(jade())
//        .pipe(gulp.dest(jadetarget))
//});

// default gulp task
gulp.task('default', function() {
   gulp.run('copyfontawesome','sass', 'scripts'); 
});
// default gulp task
gulp.task('watch', function() {
    gulp.watch('./src/scripts/*.js', ['jshint','scripts']);
    gulp.watch('./src/sass/**/*.scss', ['sass']);
    gulp.watch('./src/jade/**/*', ['jade']);
});

