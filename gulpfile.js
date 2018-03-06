// 引入 gulp
var gulp = require('gulp'); 

// 引入组件
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

// 合并，压缩content页脚本
gulp.task('default', function() {
    gulp.src(['./lib/jquery.min.js','./lib/underscore-min.js','./js/content.js'])
        .pipe(concat('content.js'))
        .pipe(gulp.dest('./dist'))
        .pipe(rename('content.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./dist'));
});
