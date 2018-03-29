// 引入 gulp
var gulp = require('gulp'); 

// 引入组件
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var del = require('del');
var gutil = require('gulp-util');
var colors = require('colors/safe');
var clean = require('gulp-clean');
var pump = require('pump');

gulp.task('clean', function (cb) {
    gutil.log(colors.red('clean start'));
    return del([
        'build/**/*',
        '!build/manifest.json'
    ], cb);
    gutil.log(colors.red('clean over'));
});

gulp.task('build:cnt',function(cb) {
    pump([
        gulp.src(['./js/content/preprocess.js','./js/content/!*-cnt.js']),
        concat('content.js'),
        rename('content.min.js'),
        uglify(),
        gulp.dest('./build/js')
    ],cb)
    /*gulp.src(['./js/content/preprocess.js','./js/content/!*-cnt.js'])
        .pipe(concat('content.js'))
        .pipe(rename('content.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./build/js'));*/
});

gulp.task('build:bg',function() {


    gulp.src(['./js/constant.js','./js/bg/*-bg.js','./js/bg/background.js'])
        .pipe(concat('bg.js'))
        .pipe(rename('bg.min.js'))
        .pipe(uglify())
        .on('error', function (err) {
            gutil.log(gutil.colors.red('[Error]'), err.toString());
            // throw err;
        })
        .pipe(gulp.dest('./build/js'));

    gulp.src(['./images/!**']).pipe(gulp.dest('./build/images'));
    gulp.src(['./css/!**']).pipe(gulp.dest('./build/css'));
    gulp.src(['./lib/!**','!./lib/vue.js']).pipe(gulp.dest('./build/lib'));
    gulp.src(['./js/!*.js']).pipe(gulp.dest('./build/js'));
    gulp.src(['./popup.html']).pipe(gulp.dest('./build'));
});


// 合并，压缩content页脚本
gulp.task('default',['clean'],function(){
    /*gulp.src(['./js/content/preprocess.js','./js/content/!*-cnt.js'])
        .pipe(concat('content.js'))
        .pipe(rename('content.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./build/js'));

    gulp.src(['./js/bg/!*-bg.js','./js/bg/background.js'])
        .pipe(concat('bg.js'))
        .pipe(rename('bg.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./build/js'));*/

    gulp.src(['./images/**']).pipe(gulp.dest('./build/images'));
    gulp.src(['./css/**']).pipe(gulp.dest('./build/css'));
    gulp.src(['./lib/**','!./lib/vue.js']).pipe(gulp.dest('./build/lib'));
    gulp.src(['./js/*.js']).pipe(gulp.dest('./build/js'));
    gulp.src(['./popup.html']).pipe(gulp.dest('./build'));
});
