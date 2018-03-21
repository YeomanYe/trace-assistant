// 引入 gulp
var gulp = require('gulp'); 

// 引入组件
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

// 合并，压缩content页脚本
gulp.task('default', function() {
    gulp.src(['./js/content/pre-cnt.js','./js/content/dmzj-cnt.js','./js/content/bilibili-cnt.js','./js/content/kuaikan-cnt.js','./js/content/qidian-cnt.js','./js/content/qq-cnt.js'])
        .pipe(concat('content.js'))
        .pipe(rename('content.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./build/js'));

    gulp.src(['./js/bg/dmzj-bg.js','./js/bg/kuaikan-bg.js','./js/bg/bilibili-bg.js','./js/bg/qidian-bg.js','./js/bg/qq-bg.js','./js/bg/bg.js'])
        .pipe(concat('bg.js'))
        .pipe(rename('bg.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./build/js'));

    gulp.src(['./images/**']).pipe(gulp.dest('./build/images'));
    gulp.src(['./css/**']).pipe(gulp.dest('./build/css'));
    gulp.src(['./lib/*min.js','./lib/!*.map']).pipe(gulp.dest('./build/lib'));
    gulp.src(['./js/*.js']).pipe(gulp.dest('./build/js'));
    gulp.src(['./background.html','./popup.html']).pipe(gulp.dest('./build'));
});
