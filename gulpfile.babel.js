import gulp from 'gulp'; //引入gulp
import gulpLoadPlugins from 'gulp-load-plugins'; //自动加载插件 省去一个一个require进来
const $ = gulpLoadPlugins();
// const reload = browserSync.reload;

gulp.task('scripts' , ()=>{
    return gulp.src('js/bg/*.js')
        .pipe($.plumber())
        .pipe($.babel())    //靠这个插件编译
        .pipe($.sourcemaps.write('.'))
        .pipe(gulp.dest('dist/js/bg'));
});

gulp.task('images',()=>{
    return gulp.src('images/**/*')
        .pipe ($.cache ($.imagemin ({ //使用cache只压缩改变的图片
            optimizationLevel: 3,         //压缩级别
            progressive: true,
            interlaced: true})
        )).pipe (gulp.dest ('dist/images'));
});

gulp.task('clean' , function(){
    return gulp.src([
        'dist', //删除dist整个文件夹
    ] ).pipe($.clean());
});

gulp.task('html', ['scripts'], ()=>{   //先执行styles scripts任务
    var version = (new Date).valueOf() + '';
    var options = {
        removeComments: false,//清除HTML注释
        collapseWhitespace: true,//压缩HTML
        collapseBooleanAttributes: false,//省略布尔属性的值 <input checked="true"/> ==> <input />
        removeEmptyAttributes: false,//删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: false,//删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: false,//删除<style>和<link>的type="text/css"
        minifyJS: false,//压缩页面里的JS
        minifyCSS: false//压缩页面里的CSS
    };
    return gulp.src('*.html')
        .pipe($.plumber())
        .pipe($.useref({searchPath: ['app', '.']}))  //将页面上 <!--endbuild--> 根据上下顺序合并
        .pipe($.if('js/*.js', $.uglify()))
        .pipe($.if('css/*.css', $.cssnano()))
        .pipe($.if('*.html', $.htmlmin(options)))
        .pipe($.replace('.js"></script>' , '.js?v=' + version + '"></script>'))   //这种方法比较不成熟 每一次的任务都会改变，不管文件是否被修改
        .pipe($.replace('.css">' , '.css?v=' + version + '">'))
        .pipe(gulp.dest('dist'));
});