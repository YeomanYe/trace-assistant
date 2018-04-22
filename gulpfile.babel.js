import gulp from 'gulp'; //引入gulp
import gulpLoadPlugins from 'gulp-load-plugins'; //自动加载插件 省去一个一个require进来
const $ = gulpLoadPlugins();
import del from 'del';

//预编译js文件，将es6变成es2015
gulp.task('pre-compile', ()=>{
    return gulp.src(['js/bg/*.js','js/cnt/*.js','js/component/*.js'])
        .pipe($.sourcemaps.init())
        .pipe($.plumber())
        .pipe($.babel())    //靠这个插件编译
        .pipe($.sourcemaps.write('.'))
        .pipe(gulp.dest('dist/temp'));
});
//编译cnt文件夹下的js文件
gulp.task('build:cnt',['pre-compile'],()=>{
    return gulp.src(['./dist/temp/preprocess.js','./dist/temp/*-cnt.js'])
        .pipe($.sourcemaps.init())
        .pipe($.concat('content.js'))
        .pipe($.rename('content.min.js'))
        .pipe($.uglify())
        .pipe($.sourcemaps.write('.'))
        .pipe(gulp.dest('./build/js'));
});
//编译bg文件夹下的js文件
gulp.task('build:bg',['pre-compile'],()=>{
    return gulp.src(['./dist/temp/*-bg.js','./dist/temp/background.js'])
        .pipe($.sourcemaps.init())
        .pipe($.concat('bg.js'))
        .pipe($.rename('bg.min.js'))
        .pipe($.uglify())
        .pipe($.sourcemaps.write('.'))
        .pipe(gulp.dest('./build/js'));
});
//编译component文件夹下的js文件
gulp.task('build:comp',['pre-compile'],()=>{
    return gulp.src(['./dist/temp/*-comp.js','js/popup.js'])
        .pipe($.sourcemaps.init())
        .pipe($.concat('popup.js'))
        .pipe($.rename('popup.min.js'))
        .pipe($.uglify())
        .pipe($.sourcemaps.write('.'))
        .pipe(gulp.dest('./build/js'));
});
gulp.task('less' , ()=>{
    return gulp.src('css/*.less') //指明源文件路径 读取其数据流
        .pipe($.plumber()) //替换错误的pipe方法  使数据流正常运行
        .pipe($.sourcemaps.init()) //压缩环境出现错误能找到未压缩的错误来源
        .pipe($.less())
        .pipe($.cssnano())
        .pipe($.sourcemaps.write('.'))  //map文件命名
        .pipe(gulp.dest('build/css'))  //指定输出路径
});
//压缩文件并重命名
gulp.task('uglify',()=>{
    var options = {
        removeComments: false,//清除HTML注释
        collapseWhitespace: true,//压缩HTML
        collapseBooleanAttributes: false,//省略布尔属性的值 <input checked="true"/> ==> <input />
        removeEmptyAttributes: false,//删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: false,//删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: false,//删除<style>和<link>的type="text/css"
        minifyJS: true,//压缩页面里的JS
        minifyCSS: true//压缩页面里的CSS
    };
    return gulp.src(['*.html','js/*.js','!js/popup.js'])
        .pipe($.plumber())
        .pipe($.sourcemaps.init())
        .pipe($.useref({noAssets:true,/*searchPath: ['app', '.']*/}))  //将页面上 <!--endbuild--> 根据上下顺序合并
        .pipe($.if('*.js', $.uglify()))
        .pipe($.if('*.html', $.htmlmin(options)))
        .pipe($.rename(path=>{
            if(path.extname.indexOf('html') < 0)
                path.dirname = path.extname.replace('.','');
        }))
        .pipe($.sourcemaps.write('.'))
        .pipe(gulp.dest('./build'));
});
//只需要移动的文件
gulp.task('pipe',()=>{
    gulp.src(['./lib/**','!./lib/vue.js']).pipe(gulp.dest('./build/lib'));
});
//压缩图片
gulp.task('images',()=>{
    return gulp.src('images/**/*')
        .pipe ($.cache ($.imagemin ({ //使用cache只压缩改变的图片
            optimizationLevel: 3,         //压缩级别
            progressive: true,
            interlaced: true})
        )).pipe (gulp.dest ('build/images'));
});
//前置清理
gulp.task('clean' , function(){
    return del([
        'dist',
        'build/**/*',
        '!build/manifest.json'
    ])
});
//后置清理，清理无用文件
gulp.task('c:after' , function(){
    return del([
        'build/**/*.map',
        'build/*.map',
        'dist'
    ])
});
//构建
gulp.task('b',['clean'],()=>{
    return gulp.start(['build:bg','build:cnt','build:comp','uglify','images','pipe','less']);
});

gulp.task('default',['b'],()=>{
    //监测变化 自动编译
    gulp.watch('js/cnt/**' , ['build:cnt']);
    gulp.watch('js/bg/**' , ['build:bg']);
    gulp.watch('css/*.less',['less']);
    gulp.watch(['js/component/**','js/popup.js'], ['build:comp']);
    gulp.watch('images/**' , ['images']);
    gulp.watch('./lib/**' , ['pipe']);
    gulp.watch(['*.html','js/*.js','!js/popup.js'],['uglify']);
});