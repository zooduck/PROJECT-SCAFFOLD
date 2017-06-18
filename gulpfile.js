"use strict"; // required if you want to use let, const, etc.

// plugins
const gulp = require("gulp");
const $ = require("gulp-load-plugins")(); // only works for gulp-prefixed dependencies (saves us having to list each of them here)
const autoprefixer = require("autoprefixer");
const del = require("del");
const pump = require("pump"); // generates more relevant error messages than pipe()
const packageJSON = require("./package.json");

// config
const projectName = packageJSON.name;
const paths = {
    distRoot:        "./dist",
    distImg:         "./dist/img",
    distFonts:       "./dist/fonts",
    distCSS:         "./dist",
    distJS:          "./dist",
    img:             "./img",
    html:            "./html",
    scripts:         "./scripts",
    stylesheetsCSS:  "./stylesheets/tmp",
    stylesheetsSASS: "./stylesheets/sass"
};
const vendorPaths = [
    "./node_modules/lodash/lodash.min.js",
    "./node_modules/moment/min/moment.min.js"
];
const fontPaths = [
    "./node_modules/font-awesome/fonts/**/*",
    "./node_modules/ionicons/dist/fonts/**/*"
];
const port = 8080;

// -------------------------------------------
// Clean files and folders
// -------------------------------------------
let cleanHTML = () => {
    return del.sync([
        `${paths.distRoot}/\**`,
        `!${paths.distRoot}`,
        `!${paths.distRoot}/img`,
        `!${paths.distRoot}/fonts`
    ]);
};

let cleanImages = () => {
    return del.sync([
        `${paths.distImg}/\**`,
        `!${paths.distImg}`
    ]);
};

let cleanFonts = () => {
    return del.sync([
        `${paths.distFonts}/\**`,
        `!${paths.distFonts}`
    ]); 
};

let cleanStylesheets = () => {
    return del.sync([
        `${paths.distCSS}/\**/\*.css`,
        `${paths.stylesheetsCSS}/\**/\*.css`,
        `!${paths.distCSS}`,
        `!${paths.stylesheetsCSS}`
    ]);    
};

let cleanScripts = () => {
    return del.sync([
        `${paths.distJS}/\**/\*.js`,
        `!${paths.distJS}`
    ]);    
};

gulp.task("clean-html", [], cleanHTML);
gulp.task("clean-images", [], cleanImages);
gulp.task("clean-fonts", [], cleanFonts);
gulp.task("clean-stylesheets", [], cleanStylesheets);
gulp.task("clean-scripts", [], cleanScripts);
gulp.task("clean", ["clean-html", "clean-stylesheets", "clean-scripts", "clean-images", "clean-fonts"], (cb) => {
    cb();
});

// -------------------------------------------
// Package Templates
// -------------------------------------------
let html = () => {
    return gulp.src(`${paths.html}/\**/\*.html`)
        .pipe(gulp.dest(paths.distRoot));
};
gulp.task("html", [], html);

// -------------------------------------------
// Package Scripts
// -------------------------------------------
let scripts = (cb) => {
    pump([
        gulp.src(`${paths.scripts}/\**/\*.js`),
        $.concat(`${projectName}.js`),
        $.babel({
            presets: ["es2015"]
        }),
        // $.uglify(),
        gulp.dest(paths.distRoot)
    ], cb);
};
gulp.task("scripts", [], scripts);

// -------------------------------------------
// Package Stylesheets
// -------------------------------------------
let sass = () => {
    return gulp.src(`${paths.stylesheetsSASS}/\**/\*.scss`)
        .pipe($.sass().on("error", $.sass.logError))
        .pipe(gulp.dest(paths.stylesheetsCSS));   
};
let stylesheets = (cb) => {
    pump([
        gulp.src(`${paths.stylesheetsCSS}/\**/\*.css`),
        $.sourcemaps.init(),
        $.postcss([ autoprefixer({ browsers: ["last 5 versions"] }) ]),
        $.concat(`${projectName}.css`),
        // $.cleanCss({compatibility: '*'}),
        $.sourcemaps.write("."),
        gulp.dest(paths.distCSS)
    ], cb);
};
gulp.task("sass", [] , sass);
gulp.task("stylesheets", ["sass"], stylesheets);

// -------------------------------------------
// Package Images
// -------------------------------------------
let images = () => {
    return gulp.src(`${paths.img}/\**/\*`)
        .pipe(gulp.dest(paths.distImg));   
};
gulp.task("images", [], images);

// -------------------------------------------
// Package Fonts
// -------------------------------------------
let fonts = () => {
    return gulp.src(fontPaths)
        .pipe(gulp.dest(paths.distFonts));
};
gulp.task("fonts", [], fonts);

// -------------------------------------------
// Package Third-Party Libraries
// -------------------------------------------
let dependencies = () => {
    return gulp.src(vendorPaths)
        .pipe($.concat(`${projectName}.dependencies.js`))
        .pipe(gulp.dest(paths.distRoot));
};
gulp.task("dependencies", [], dependencies);

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
        uri: `http:\/\/localhost:${port}`,
        app: "chrome"
    }
    gulp.src("./")
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
    ]).on("change", (file) => {
        $.livereload.changed(file.path);
    });
    gulp.watch(paths["scripts"] + "/*.js", {interval: 500}, ["scripts"]);
    gulp.watch(paths["stylesheets"] + "/sass/*.scss", {interval: 500}, ["stylesheets"]);
    gulp.watch(paths["html"] + "/*.html", {interval: 500}, ["html"]);
};

// -------------------------------------------
// Run All Tasks
// -------------------------------------------
gulp.task("default", ["clean", "html", "dependencies", "scripts", "stylesheets", "images", "fonts"], function (cb) {
    cb();
    setTimeout( () => {
        watch();
        connect();
        $.util.log("Gulp started and watching for changes...");
    }, 1000); // timeout required or not all files get compiled before watch starts
});
