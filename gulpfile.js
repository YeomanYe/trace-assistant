// 引入 gulp
var gulp = require('gulp'); 

// 引入组件
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

// 合并，压缩content页脚本
gulp.task('default', function() {
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
    gulp.src(['./lib/**']).pipe(gulp.dest('./build/lib'));
    gulp.src(['./js/*.js']).pipe(gulp.dest('./build/js'));
    gulp.src(['./popup.html']).pipe(gulp.dest('./build'));
});
