// 引入 gulp
var gulp = require('gulp'); 

// 引入组件
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

// 合并，压缩content页脚本
gulp.task('default', function() {
    gulp.src(['./js/content/pre-content.js','./js/content/dmzj-content.js','./js/content/kuaikan-content.js','./js/content/qq-content.js'])
        .pipe(concat('content.js'))
        .pipe(rename('content.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./build/js'));
    gulp.src(['./js/bg/dmzj-bg.js','./js/bg/kuaikan-bg.js','./js/bg/qq-bg.js','./js/bg/bg.js'])
        .pipe(concat('bg.js'))
        .pipe(rename('bg.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./build/js'));
});
