// 引入 gulp
var gulp = require('gulp'); 

// 引入组件
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var del = require('del');
var runSequence = require('run-sequence');
var gutil = require('gulp-util');
var colors = require('colors/safe');

gulp.task('clean', function (cb) {
    gutil.log(colors.red('clean start'));
    return del([
        // 这里我们使用一个通配模式来匹配 `mobile` 文件夹中的所有东西
        'build/**/*',
        // 我们不希望删掉这个文件，所以我们取反这个匹配模式
        '!build/manifest.json'
    ], cb);
    gutil.log(colors.red('clean over'));
});

gulp.task('build',['clean'],function() {
    gutil.log(colors.red('build start'));
    gulp.src(['./js/content/preprocess.js','./js/content/*-cnt.js'])
        .pipe(concat('content.js'))
        .pipe(rename('content.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./build/js'));

    gulp.src(['./js/bg/*-bg.js','./js/bg/background.js'])
        .pipe(concat('bg.js'))
        .pipe(rename('bg.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./build/js'));

    gulp.src(['./images/**']).pipe(gulp.dest('./build/images'));
    gulp.src(['./css/**']).pipe(gulp.dest('./build/css'));
    gulp.src(['./lib/**','!./lib/vue.js']).pipe(gulp.dest('./build/lib'));
    gulp.src(['./js/*.js']).pipe(gulp.dest('./build/js'));
    gulp.src(['./popup.html']).pipe(gulp.dest('./build'));
    gutil.log(colors.red('build start'));
});


// 合并，压缩content页脚本
gulp.task('default',['build'],function () {

});
