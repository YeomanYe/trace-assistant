import gulp from 'gulp'; //引入gulp
import gulpLoadPlugins from 'gulp-load-plugins'; //自动加载插件 省去一个一个require进来
import browserSync from 'browser-sync'; //浏览器同步
import {stream as wiredep} from 'wiredep'; //把bower 下载的文件引入到html文件中
const $ = gulpLoadPlugins();
// const reload = browserSync.reload;

gulp.task('scripts' , ()=>{
    return gulp.src('js/bg/*.js')
        .pipe($.plumber())
        .pipe($.babel())    //靠这个插件编译
        .pipe($.sourcemaps.write('.'))
        .pipe(gulp.dest('dist/scripts'));
});