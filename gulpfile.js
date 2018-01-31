// 引入 gulp
var gulp = require('gulp'); 

// 引入组件
// var jshint = require('gulp-jshint');
// var sass = require('gulp-sass');
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

// 默认任务
/*gulp.task('default', function(){
    gulp.run('lint', 'sass', 'scripts');

    // 监听文件变化
    gulp.watch('./js/*.js', function(){
        gulp.run('lint', 'sass', 'scripts');
    });
});*/