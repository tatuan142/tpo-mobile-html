// ====================================
// gulp file
// ====================================

/*
* TABLE OF CONTENTS
*
* require gulp
* define paths of folder, project name
* add error text debug
* javascripts
* styles
* copy
* image
* delete build folder
* make aboveTheFold (full version)
* taskrunner
*/


// > require gulp
var gulp = require('gulp'),
    del = require('del'),
    browserSync = require('browser-sync').create(),
    concat = require('gulp-concat'),
    cssmin = require('gulp-minify-css'),
    rename = require("gulp-rename"),
    sass = require('gulp-sass'),
    uglify = require('gulp-uglify'),
    sourcemaps = require('gulp-sourcemaps'),
    inject = require('gulp-inject-string'),
    imagemin = require('imagemin'),
    imageminPngquant = require('imagemin-pngquant'),
    removeCode = require('gulp-remove-code'),
    cssbeautify = require('gulp-cssbeautify'),
    rmLines = require('gulp-rm-lines');

// > define paths of folder, project name
var paths = {
    project_name: "news",
    source_folder: "./source",
    build_folder: "./build",
    js_dev: './source/js',
    js: './build/Jscripts',
    scss_dev: './source/scss',
    css: './build/styles/css',
    html_dev: "./source/demo-html",
    html: "./build/demo-html",
    fonts_dev: "./source/fonts",
    fonts: "./build/styles/fonts",
    img_dev: "./source/img",
    img: "./build/styles/img",
    figImg_dev: "./source/fig-images",
    figImg: "./build/demo-html/fig-images"
};

// > add error text debug
    // note : for mobile - style
    var reportError = function(error) {
        var text = error.toString();
        text = text.replace(/\n/gm, " \\A ");
        text = text.replace(/('|")/gm, " ");
        gulp.src(paths.css + '/mobile-styles.min.css')
            .pipe(inject.append("body:before{content : '" + text + "';white-space: pre;padding: 50px;display: block;}"))
            .pipe(gulp.dest(paths.css))
            .pipe(browserSync.stream({ once: true }));
    }

// > javascripts
gulp.task('scripts', function() {
    return gulp.src([
            // import plugin
            paths.js_dev + '/vendor/jquery-3.1.1.js',
            // paths.js_dev + '/vendor/jquery-migrate-3.0.0.js', // make older code can run in newest jquery
            // paths.js_dev + '/vendor/jquery.bxslider.js', //  slider 
            // paths.js_dev + '/vendor/jquery.fixer.js', // stick content 
            paths.js_dev + '/photoSwipe/dist/photoswipe.min.js', //popup image  ++++ warning với jquery3.1.1 
            paths.js_dev + '/photoSwipe/dist/photoswipe-ui-default.min.js', //popup image 
            // end import plugin
        ])
        .pipe(concat(paths.project_name + '.js'))
        // .pipe(gulp.dest(paths.js)) // make normal js for debug
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest(paths.js))
        .pipe(browserSync.stream({ once: true }));
});


// > styles 
// Mobile, soccer widget , soccer
    // main mobile style
    gulp.task('mobile-styles', function() {
        gulp.src(paths.scss_dev + '/mobile-styles.scss')
            .pipe(sourcemaps.init())
            .pipe(sass().on('error', reportError))
            .pipe(rename({
                suffix: '.min'
            }))
            .pipe(cssmin())
            // .pipe(gulp.dest(paths.css)) // make normal css for debug
            .pipe(sourcemaps.write('../maps'))
            .pipe(gulp.dest(paths.css))
            .pipe(browserSync.stream({ once: true }));
    });

// > copy 
// copy sftp, ui.js, js, copyJs, copyFigImg, copyFonts
    gulp.task('copySftp', function() {
        gulp.src(paths.source_folder + '/sftp-config')
            .pipe(rename({
                basename: 'sftp-config',
                extname: '.json'
            }))
            .pipe(gulp.dest('./build'));
    });

    // copy only ui.js file
    gulp.task('copyJs-UI', function() {
        gulp.src(paths.js_dev + '/ui-local.js')
            .pipe(gulp.dest(paths.js)).pipe(browserSync.stream({ once: true }));

    });

    gulp.task('copyJs', function() {
        gulp.src(paths.js_dev + '/**/*')
            .pipe(gulp.dest(paths.js));

    });

    gulp.task('copyHtml', function() {
        gulp.src(paths.html_dev + '/**/*')
            .pipe(gulp.dest(paths.html));
    });

    gulp.task('copyFigImg', function() {
        gulp.src(paths.figImg_dev + '/**/*')
            .pipe(gulp.dest(paths.figImg));
        gulp.src(paths.img_dev + '/*.gif')
            .pipe(gulp.dest(paths.img));
    });

    gulp.task('copyFonts', function() {
        gulp.src(paths.fonts_dev + '/**/*')
            .pipe(gulp.dest(paths.fonts));
    });

    gulp.task('copy', ['copySftp', 'copyJs', 'copyHtml', 'copyFigImg', 'copyFonts']);

// > image
// note : compress image
    gulp.task('compressImg', () =>
        imagemin([paths.img_dev + '/*.png'], paths.img, {
            use: [imageminPngquant({
                // floyd : '1',
                // nofs : true,
                speed: '1',
                // verbose : true
            })]
        })
        .then(() => {
            console.log('mobile Images optimized');
        })
    );

// > delete build folder
gulp.task('delete', function() {
    del.sync(paths.build_folder);
});

// > make aboveTheFold (full version) 
    /*
    for main style (not include error, soccer)
    steps :  
    - scan style.css
    - beautify style.css
    - clone to abf
    - remove un-use attribute style
    - remove codes in {abf: true}
    - minify style.css
    - add some customize code
    - change path of fonts and image
    - release abf.css
    */
    /*
    gulp.task('aboveTheFold', function() {
        gulp.src(paths.css + '/mobile-styles.css')
            .pipe(cssbeautify())
            .pipe(rename({
                basename: 'aboveTheFold'
            }))
            .pipe(gulp.dest(paths.css))
            .pipe(rmLines({
                'filters': [
                    /UTF-8/i,
                    /normalize.css/i,
                    /background/i,
                    /color:/i,
                    /opacity:/i,
                    /radius:/i,
                    /z-index:/i,
                    /rem;/i,
                    /cursor:/i,
                    /box-shadow:/i,
                ]
            }))
            // .pipe(removeCode({ abf: true }))
            .pipe(cssmin())
            .pipe(inject.replace('../fonts', 'https://baomoi-static.zadn.vn/web/styles/fonts'))
            .pipe(inject.replace('../img', 'https://baomoi-static.zadn.vn/web/styles/img'))
            .pipe(gulp.dest(paths.css));
    });
    */

// note : make abf.css (short version)
gulp.task('abf', function() {
    gulp.src(paths.css + '/mobile-styles.css')
        .pipe(rename({
            basename: 'mobile-abf'
        }))
        .pipe(cssmin())
        .pipe(inject.replace('../fonts', 'https://baomoi-static.zadn.vn/web/styles/fonts'))
        .pipe(inject.replace('../img', 'https://baomoi-static.zadn.vn/web/styles/img'))
        .pipe(gulp.dest(paths.css));
});


// > taskrunner
// note : for mobile task
gulp.task('default', ['copy', 'compressImg', 'mobile-styles'],
    function() {
        browserSync.init({
            server: {
                baseDir: "./"
            },
            open: false,
            ghostMode: {
                // scroll: true
            }
        });
        gulp.watch(paths.scss_dev + '/**/*.scss', ['mobile-styles', 'abf']);
        gulp.watch(paths.js_dev + '/**/*.js', function(obj) {
            if (obj.type === 'changed') {
                gulp.src(obj.path, { "base": paths.js_dev})
                    .pipe(gulp.dest(paths.js));
            }
        }).on('change', browserSync.reload);
        gulp.watch(paths.html_dev + '/**/*.html', function(obj) {
            if (obj.type === 'changed') {
                gulp.src(obj.path, { "base": paths.html_dev})
                    .pipe(gulp.dest(paths.html));
            }
        }).on('change', browserSync.reload);
    }
);

// note : for soccer task