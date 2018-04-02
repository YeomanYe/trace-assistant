import gulp from 'gulp'; //引入gulp
import gulpLoadPlugins from 'gulp-load-plugins'; //自动加载插件 省去一个一个require进来
const $ = gulpLoadPlugins();
import del from 'del';
// const reload = browserSync.reload;
//预编译js文件，将es6变成es2015
gulp.task('pre-compile', ()=>{
    return gulp.src(['js/bg/*.js','js/cnt/*.js','js/component/*.js'])
        .pipe($.plumber())
        .pipe($.babel())    //靠这个插件编译
        .pipe($.sourcemaps.write('.'))
        .pipe(gulp.dest('dist/js'));
});
//编译cnt文件夹下的js文件
gulp.task('build:cnt',['pre-compile'],()=>{
    return gulp.src(['./dist/js/preprocess.js','./dist/js/*-cnt.js'])
        .pipe($.concat('content.js'))
        .pipe($.rename('content.min.js'))
        .pipe($.uglify())
        .pipe(gulp.dest('./build/js'));
});
//编译bg文件夹下的js文件
gulp.task('build:bg',['pre-compile'],()=>{
    return gulp.src(['./dist/js/*-bg.js','./dist/js/background.js'])
        .pipe($.concat('bg.js'))
        .pipe($.rename('bg.min.js'))
        .pipe($.uglify())
        .pipe(gulp.dest('./build/js'));
});
//编译component文件夹下的js文件
gulp.task('build:comp',['pre-compile'],()=>{
    return gulp.src(['./dist/js/*-comp.js','js/popup.js'])
        .pipe($.concat('popup.js'))
        .pipe($.rename('popup.min.js'))
        .pipe($.uglify())
        .pipe(gulp.dest('./build/js'));
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
    return gulp.src(['*.html','js/*.js','css/*.css','!js/popup.js'])
        .pipe($.plumber())
        .pipe($.useref({noAssets:true,/*searchPath: ['app', '.']*/}))  //将页面上 <!--endbuild--> 根据上下顺序合并
        .pipe($.if('*.js', $.uglify()))
        .pipe($.if('*.css', $.cssnano()))
        .pipe($.if('*.html', $.htmlmin(options)))
        .pipe($.rename(path=>{
            if(path.extname.indexOf('html') < 0)
                path.dirname = path.extname.replace('.','');
        }))
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

gulp.task('clean' , function(){
    return del([
        'dist',
        'build/**/*',
        '!build/manifest.json'
    ])
});

gulp.task('default',['clean'],()=>{
    gulp.start(['build:bg','build:cnt','build:comp','uglify','images','pipe']);
});

/*
gulp.task('html', ['scripts'], ()=>{
    // var version = (new Date).valueOf() + '';
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
        // .pipe($.useref({searchPath: ['app', '.']}))  //将页面上 <!--endbuild--> 根据上下顺序合并
        // .pipe($.if('*.js', $.uglify()))
        // .pipe($.if('*.css', $.cssnano()))
        .pipe($.if('*.html', $.htmlmin(options)))
        // .pipe($.replace('.js"></script>' , '.js?v=' + version + '"></script>'))   //这种方法比较不成熟 每一次的任务都会改变，不管文件是否被修改
        // .pipe($.replace('.css">' , '.css?v=' + version + '">'))
        .pipe(gulp.dest('dist'));
});*/
