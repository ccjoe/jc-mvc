var gulp = require('gulp'),
    path  = require('path'),
    config = {
      buildDir: './static/dist',
      srcDir: './static/src'
    };
// 生成相应环境的各目录
// 'B' BUILD VERSION, 'S' SRC VERSION
var G = function(buildType, dirType){
  if(buildType=== 'B')
    return path.join(config.buildDir, dirType)
 if(buildType=== 'S')
    return path.join(config.srcDir, dirType)
};

/*================================================
=            Report Errors to Console            =
================================================*/

gulp.on('error', function(e) {
  throw(e);
});

/*=========================================
=            Clean dest folder            =
=========================================*/

gulp.task('clean', function (cb) {
  return gulp.src([
        G('B','html'),G('B','img'),G('B','css'),G('B','js'),G('B','fonts')], { read: false })
     .pipe(rimraf());
});

/*=========================================
=            For Develop            =
=========================================*/
//for bower->lib ---------------
var gulpBowerFiles = require('main-bower-files');
gulp.task("bower-files", function(){
    return gulp.src(gulpBowerFiles({
    }), { base: './bower_components' })
    .pipe(gulp.dest("./static/src/lib"));
});

// sass->less ---------------
var sass = require('gulp-ruby-sass');
gulp.task('sass', function () {
  return sass('./static/src/sass/')
    .pipe(gulp.dest('./static/src/css'))
    .pipe(livereload());
});

// plumber = require('gulp-plumber'),
// livereload && nodemon ---------------
var nodemon = require('gulp-nodemon'),
    livereload = require('gulp-livereload');
  
gulp.task('watch', function() {
  gulp.watch('./static/src/sass/', ['sass']);
});

gulp.task('develop', function () {
  livereload.listen();
  nodemon({
    script: 'app.js',
    ext: 'js coffee ejs',
  }).on('restart', function () {
    setTimeout(function () {
      livereload.changed(__dirname);
    }, 500);
  });
});

/*=========================================
=             For Build            =
=========================================*/
//处理js合并压缩语法相关 ---------------
var concat = require("gulp-concat");
var uglify = require("gulp-uglify"); 
var jshint = require("gulp-jshint");

gulp.task('jsLint', function () {
    gulp.src('./static/src/js/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter()); // 输出检查结果
});

gulp.task('deal-js', function () {
    gulp.src('./static/src/js/*.js') // 要压缩的js文件
    .pipe(uglify())  //使用uglify进行压缩,更多配置请参考：
    .pipe(concat('index.min.js'))  // 合并匹配到的js文件并命名
    .pipe(gulp.dest('./static/dist/js'));
});

//处理css合并压缩 ---------------
var minifyCss = require("gulp-minify-css");
gulp.task('deal-css', function () {
    gulp.src('css/*.css') // 要压缩的css文件
    .pipe(minifyCss()) //压缩css
    .pipe(concat('index.min.css'))  // 合并匹配到的css文件并命名
    .pipe(gulp.dest('dist/css'));
});

//处理图片 ---------------
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant'); //png图片压缩插件
gulp.task('deal-img', function () {
    return gulp.src('src/img/*')
        .pipe(imagemin({
            progressive: true,
            use: [pngquant()] //使用pngquant来压缩png图片
        }))
        .pipe(gulp.dest('./static/dist/img'));
});
//处理字体,svg... ---------------

//处理html相关 ---------------
var minifyHtml = require("gulp-minify-html");
gulp.task('deal-html', function () {
    gulp.src('./static/views/*.html') // 要压缩的html文件
    .pipe(minifyHtml()) //压缩
    .pipe(gulp.dest('./static/dist/html'));
});


// 综合
gulp.task('default', [
  'sass',
  'bower-files',
  'develop',
  'watch'
]);

gulp.task('build', [
  'jsLint',
  'deal-js',
  'deal-css',
  'deal-img',
  'deal-html',
]);