import gulp from 'gulp'; //引入gulp
import gulpLoadPlugins from 'gulp-load-plugins'; //自动加载插件 省去一个一个require进来
const $ = gulpLoadPlugins();
import del from 'del';
import source from 'vinyl-source-stream';
import browserify from 'browserify';

//编译cnt文件夹下的js文件
gulp.task('build:cnt',()=>{
    return gulp.src(['js/cnt/preprocess.js','js/cnt/*-cnt.js'])
        .pipe($.sourcemaps.init())
        .pipe($.plumber())
        .pipe($.babel())
        .pipe($.concat('content.js'))
        .pipe($.rename('content.min.js'))
        .pipe($.uglify())
        .pipe($.sourcemaps.write('.'))
        .pipe(gulp.dest('./build/js'));
});
//gulp主动设置的命令
gulp.task("dependency",()=>{
    //通过browserify管理依赖
    browserify({
        //入口点,app.jsx
        entries : ["./js/back-dep.js"]
    })
    //转换为gulp能识别的流
    .bundle()
    //合并输出为app.js
    .pipe(source("back-dep.js"))
    //输出到当前文件夹中
    .pipe(gulp.dest("./build/js"));
});
//编译bg文件夹下的js文件
gulp.task('build:bg',()=>{
    return gulp.src(['lib/buffer.js','js/bg/*-bg.js','js/bg/background.js'])
        .pipe($.sourcemaps.init())
        .pipe($.plumber())
        .pipe($.babel())
        .pipe($.concat('bg.js'))
        .pipe($.rename('bg.min.js'))
        .pipe($.uglify())
        .pipe($.sourcemaps.write('.'))
        .pipe(gulp.dest('./build/js'));
});
//编译component文件夹下的js文件
gulp.task('build:comp',()=>{
    return gulp.src(['js/component/*.js','js/App.js'])
        .pipe($.sourcemaps.init())
        .pipe($.plumber())
        .pipe($.babel())
        .pipe($.concat('popup.js'))
        .pipe($.rename('popup.min.js'))
        .pipe($.uglify())
        .pipe($.sourcemaps.write('.'))
        .pipe(gulp.dest('./build/js'));
});
//less编译
gulp.task('less' , ()=>{
    return gulp.src('css/*.less') //指明源文件路径 读取其数据流
        .pipe($.plumber()) //替换错误的pipe方法  使数据流正常运行
        .pipe($.sourcemaps.init()) //压缩环境出现错误能找到未压缩的错误来源
        .pipe($.less())
        .pipe($.cssnano({zindex:false}))
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
    return gulp.src(['*.html','css/*.css','js/*.js','!js/App.js'])
        .pipe($.plumber())
        .pipe($.sourcemaps.init())
        .pipe($.useref({noAssets:true,/*searchPath: ['app', '.']*/}))  //将页面上 <!--endbuild--> 根据上下顺序合并
        .pipe($.if('*.js', $.uglify()))
        .pipe($.if('*.html', $.htmlmin(options)))
        .pipe($.if('*.css',$.cssnano()))
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
    return gulp.start(['build:bg','dependency','build:cnt','build:comp','uglify','images','pipe','less']);
});

gulp.task('default',['b'],()=>{
    //监测变化 自动编译
    gulp.watch('js/cnt/**' , ['build:cnt']);
    gulp.watch('js/bg/**' , ['build:bg']);
    gulp.watch('css/*.less',['less']);
    gulp.watch('js/back-dep.js',['dependency']);
    gulp.watch(['js/component/**','js/App.js'], ['build:comp']);
    gulp.watch('images/**' , ['images']);
    gulp.watch('./lib/**' , ['pipe']);
    gulp.watch(['*.html','js/*.js','css/*.css','!js/App.js'],['uglify']);
});
