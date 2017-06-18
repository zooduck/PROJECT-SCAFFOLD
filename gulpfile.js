'use strict'; // required if you want to use let, const, etc.

// plugins
const gulp = require('gulp');
const $ = require('gulp-load-plugins')(); // only works for gulp-prefixed dependencies (saves us having to list each of them here)
const autoprefixer = require('autoprefixer');
const del = require('del');
const pump = require('pump'); // generates more relevant error messages than pipe()
const packageJSON = require('./package.json');

// config
const projectName = packageJSON.name;
const paths = {
	'distRoot':        './dist',
	'distImg':         './dist/img',
	'distFonts':       './dist/fonts',
	'distCSS':         './dist',
	'distJS':          './dist',
	'img':             './img',
	'html':            './html',
	'scripts':         './scripts',
	'stylesheetsCSS':  './stylesheets/css',
	'stylesheetsSASS': './stylesheets/sass'
};
const vendorPaths = [
	'./node_modules/lodash/lodash.min.js',
	'./node_modules/moment/min/moment.min.js'
];
// NOTE: @17-06-2017 npm or yarn installs of ionicons were missing the android icons (bower version was good, but bower is deprecated)
// hence why I had to download the library from ionicons.com instead...
const fontPaths = [
	'./node_modules/font-awesome/fonts/**/*',
	'./node_modules/ionicons/dist/fonts/**/*'
];
const port = 8080;

// -------------------------------------------
// Clean files and folders
// -------------------------------------------
gulp.task('clean-html', [], () => {
	return del.sync([
		`${paths.distRoot}/\**`,
		`!${paths.distRoot}`,
		`!${paths.distRoot}/img`,
		`!${paths.distRoot}/fonts`
	]);
});

gulp.task('clean-images', [], () => {
	return del.sync([
		`${paths.distImg}/\**`,
		`!${paths.distImg}`
	]);
});

gulp.task('clean-fonts', [], () => {
	return del.sync([
		`${paths.distFonts}/\**`,
		`!${paths.distFonts}`
	]);
});

gulp.task('clean-stylesheets', [], () => {
	return del.sync([
		`${paths.distCSS}/\**/\*.css`,
		`${paths.stylesheetsCSS}/\**/\*.css`,
		`!${paths.distCSS}`,
		`!${paths.stylesheetsCSS}`
	]);
});

gulp.task('clean-scripts', [], () => {
	return del.sync([
		`${paths.distJS}/\**/\*.js`,
		`!${paths.distJS}`
	]);
});


gulp.task('clean', ['clean-html', 'clean-stylesheets', 'clean-scripts', 'clean-images', 'clean-fonts'], (cb) => {
	cb();
});

// -------------------------------------------
// Package Templates
// -------------------------------------------
gulp.task('html', [], () => {
	gulp.src('./html/**')
		.pipe(gulp.dest(paths.distRoot));
});

// -------------------------------------------
// Package Scripts
// -------------------------------------------
gulp.task('scripts', [], (cb) => {
	pump([
		gulp.src(`${paths.scripts}/\**/\*.js`),
		$.concat(`${projectName}.js`),
		$.babel({
			presets: ['es2015']
		}),
		// $.uglify(),
		gulp.dest(paths.distRoot)
	], cb);
});

// -------------------------------------------
// Package Stylesheets
// -------------------------------------------
gulp.task('sass', [], () => {
	return gulp.src(`${paths.stylesheetsSASS}/\**/\*.scss`)
		.pipe($.sass().on('error', $.sass.logError))
		.pipe(gulp.dest(paths.stylesheetsCSS));
});

gulp.task('stylesheets', ['sass'], (cb) => {
	pump([
		gulp.src(`${paths.stylesheetsCSS}/\**/\*.css`),
		$.sourcemaps.init(),
		$.postcss([ autoprefixer({ browsers: ['last 5 versions'] }) ]),
		$.concat(`${projectName}.css`),
		// $.cleanCss({compatibility: '*'}),
		$.sourcemaps.write('.'),
		gulp.dest(paths.distCSS)
	], cb);
});

// -------------------------------------------
// Package Images
// -------------------------------------------
gulp.task('images', [], () => {
	return gulp.src('./img/**/*')
		.pipe(gulp.dest(paths.distImg));
});

// -------------------------------------------
// Package Fonts
// -------------------------------------------
gulp.task('fonts', [], () => {
	return gulp.src(fontPaths)
		.pipe(gulp.dest(paths.distFonts));
});

// -------------------------------------------
// Package Third-Party Libraries
// -------------------------------------------
gulp.task('dependencies', [], () => {
	return gulp.src(vendorPaths)
		.pipe($.concat(`${projectName}.dependencies.js`))
		.pipe(gulp.dest(paths.distRoot));
});

// -------------------------------------------
// Start Local Server
// -------------------------------------------
let connect = () => {
	$.connect.server({
		root: paths.distRoot,
		port: port,
		livereload: true
	});
	var options = {
		uri: 'http://localhost:' + port,
		app: 'chrome'
	}
	gulp.src('./')
		.pipe($.open(options));
};

// -------------------------------------------
// Watch files for changes
// -------------------------------------------
let watch = () => {
	$.livereload.listen();
	gulp.watch([
		`${paths.distRoot}/\*.html`,
		`${paths.distRoot}/\*.css`,
		`${paths.distRoot}/\*.js`,
	]).on('change', (file) => {
		$.livereload.changed(file.path);
	});
	gulp.watch(paths['scripts'] + '/*.js', {interval: 500}, ['scripts']);
	gulp.watch(paths['stylesheets'] + '/sass/*.scss', {interval: 500}, ['stylesheets']);
	gulp.watch(paths['html'] + '/*.html', {interval: 500}, ['html']);
};

// -------------------------------------------
// Run All Tasks
// -------------------------------------------
gulp.task('default', ['clean', 'html', 'dependencies', 'scripts', 'stylesheets', 'images', 'fonts'], function (cb) {
	cb();
	setTimeout( () => {
		watch();
		connect();
		$.util.log('Gulp started and watching for changes...');
	}, 1000); // timeout required or not all files get compiled before watch starts
});
