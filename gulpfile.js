var gulp = require('gulp');
var uglify = require('gulp-uglify');	//remove empty spaces and tabs and linebreaks in .js files
var livereload = require('gulp-livereload'); //livereload is unreliable so just use 'Open with Live Server' option after right clicking html file
var concat = require('gulp-concat'); //combine all the .css files into one
var minifyCss = require('gulp-minify-css');
var autoprefixer = require('gulp-autoprefixer'); // does not work with less
var plumber = require('gulp-plumber'); //keeps gulp watch still running after encountering errors so there is no need to reboot 'gulp watch'
// gulp-plumber may not be needed by using '.on('error', cbFunction)'
var sourcemaps = require('gulp-sourcemaps'); // this is used to show css files on chrome dev tools on the browser for debugging
var sass = require('gulp-sass');

// Less plugins
var less = require('gulp-less');
var LessAutoprefix = require('less-plugin-autoprefix');
var lessAutoprefix = new LessAutoprefix({
	browsers: ['last 2 versions']
});

// File paths
var DIST_PATH = 'public/dist';
var SCRIPTS_PATH = 'public/scripts/**/*.js';
var CSS_PATH = 'public/css/**/*.css';
var SASS_PATH = 'public/scss/**/*.scss';
var LESS_PATH = 'public/less/**/*.less';

// Styles --> run with 'gulp styles' in terminal at root
gulp.task('styles', function() {
	console.log('starting styles task');
	// return gulp.src(CSS_PATH)
	return gulp.src(['public/css/reset.css', CSS_PATH]) //load reset.css first
		// .pipe(plumber(function(err) {
		// 	console.log('Styles Task Error');
		// 	console.log(err);
		// 	this.emit('end');
		// }))
		.on('error', function(err) {
			console.log(err.toString());
			this.emit('end')
		})
		.pipe(sourcemaps.init())
		.pipe(autoprefixer({
			browsers: ['last 2 versions', 'ie 8'], //last 2 versions of every major browser and Internet Explorer 8
			cascade: false
		}))
		.pipe(concat('styles.css'))
		.pipe(minifyCss())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(DIST_PATH))
		.pipe(livereload());
});

// Styles for SCSS
gulp.task('sass', function() {
	console.log('starting sass task');
	return gulp.src('public/scss/sass.scss') 
		.on('error', function(err) {
			console.log(err.toString());
			this.emit('end')
		})
		.pipe(sourcemaps.init())
		.pipe(autoprefixer({
			browsers: ['last 2 versions', 'ie 8'], //last 2 versions of every major browser and Internet Explorer 8
			cascade: false
		}))
		.pipe(sass({
			outputStyle: 'compressed'
		})) // file name comes from the imported .scss file
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(DIST_PATH))
		.pipe(livereload());
});

// Styles for LESS
gulp.task('less', function() {
	console.log('starting less task');
	return gulp.src('public/less/less.less') 
		.on('error', function(err) {
			console.log(err.toString());
			this.emit('end')
		})
		.pipe(sourcemaps.init())
		.pipe(less({
			plugins: [lessAutoprefix]
		}))
		.pipe(minifyCss())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(DIST_PATH))
		.pipe(livereload());
});

// Scripts -> run with 'gulp scripts' in terminal at root
gulp.task('scripts', function() {
	console.log('starting scripts task');
	return gulp.src(SCRIPTS_PATH)
		.pipe(uglify())
		.pipe(gulp.dest(DIST_PATH))
		.pipe(livereload())
});

// Images -> run with 'gulp images' in terminal at root
gulp.task('images', function(end) {
	console.log('starting images task');
	end();
});

// Default -> run with 'gulp' in terminal at root
gulp.task('default', function(end) {
	console.log('Starting default task');
	end();
});

gulp.task('watch', function(end) {
	console.log('starting watch task');
	require('./server.js'); //start the code inside server.js which boots up the local host
	livereload.listen(); //start livereload on port 35729 to auto reload changes that are triggered in the 'scripts' task
	gulp.watch(SCRIPTS_PATH, gulp.series('scripts'));
	gulp.watch(CSS_PATH, gulp.series('styles'));
	gulp.watch(SASS_PATH, gulp.series('sass'));
	gulp.watch(LESS_PATH, gulp.series('less'));
	end(); 
})