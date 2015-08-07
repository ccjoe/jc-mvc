var gulp = require('gulp'),
    path  = require('path'),
    config = {
      buildDir: './static/dist',
      srcDir: './static/src'
    };
// 生成相应环境的各目录
// 'B' BUILD VERSION, 'S' SRC VERSION
/*var G = function(buildType, dirType){
  if(buildType=== 'B')
    return path.join(config.buildDir, dirType)
 if(buildType=== 'S')
    return path.join(config.srcDir, dirType)
};*/


/*================================================
=            Report Errors to Console            =
================================================*/

gulp.on('error', function(e) {
  throw(e);
});

/*=========================================
=            Clean dest folder            =
=========================================*/

var del = require('del');
gulp.task('del:dist', function (cb) {
  del([
    './static/dist'
    // here we use a globbing pattern to match everything inside the `mobile` folder
    // 'dist/mobile/**/*',
    // we don't want to clean this file though so we negate the pattern
    // '!dist/mobile/deploy.json'
  ], cb);
});

gulp.task('del:dev', function (cb) {
  del([
    './static/src/lib'
  ], cb);
});

/*=========================================
=            For Develop            =
=========================================*/
//for bower->lib ---------------
var gulpBowerFiles = require('main-bower-files');
gulp.task("bower-files", ['del:dev'], function(){
    return gulp.src(gulpBowerFiles({}), { base: './bower_components' })
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
  return  gulp.src('./static/src/js/')
    .pipe(jshint())
    .pipe(jshint.reporter()); // 输出检查结果
});

gulp.task('deal-js', function () {
   return gulp.src('./static/src/js/*.js') // 要压缩的js文件
    .pipe(uglify())  //使用uglify进行压缩,更多配置请参考：
    .pipe(concat('index.js'))  // 合并匹配到的js文件并命名
    .pipe(gulp.dest('./static/dist/js'));
});

//处理css合并压缩 ---------------
var minifyCss = require("gulp-minify-css");
gulp.task('deal-css', function () {
   return gulp.src('./static/src/css/*.css') // 要压缩的css文件
    .pipe(minifyCss()) //压缩css
    .pipe(concat('index.css'))  // 合并匹配到的css文件并命名
    .pipe(gulp.dest('./static/dist/css'));
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
gulp.task('deal-font', function () {
    return gulp.src(['src/font/*', './static/src/lib/**/fonts/*'])
        .pipe(gulp.dest('./static/dist/fonts'));
});


//处理html相关 ---------------
var minifyHtml = require("gulp-minify-html");
gulp.task('deal-html', function () {
   return gulp.src('./static/views/*.html') // 要压缩的html文件
    .pipe(minifyHtml()) //压缩
    .pipe(gulp.dest('./static/dist/html'));
});

//处理bower里的资源 ---------------
// var gulpFilter = require('gulp-filter');
// var jsFilter = gulpFilter('**/*.js', {restore: true, passthrough: false});
// var cssFilter = gulpFilter('**/*.css', {restore: true});
// gulp.task('deal-bower', function () {
//  return gulp.src('./static/src/lib/**')
//         .pipe(jsFilter)
//         .pipe(uglify())
//         .pipe(concat('vendor.js'))
//         .pipe(cssFilter)
//         .pipe(minifyCss()) 
//         .pipe(concat('vendor.css'))
//         // .pipe(cssFilter.restore)
//         .pipe(gulp.dest('./static/dist/css'));
//     jsFilter.restore.pipe(gulp.dest('./static/dist/js'));

// });

gulp.task('deal-bower-js', function () {
   return gulp.src('./static/src/lib/**/*.js') // 要压缩的js文件
    .pipe(uglify())  
    .pipe(concat('vendor.js')) 
    .pipe(gulp.dest('./static/dist/js'));
});

gulp.task('deal-bower-css', function () {
   return gulp.src('./static/src/lib/**/*.css') 
    .pipe(minifyCss()) 
    .pipe(concat('vendor.css'))
    .pipe(gulp.dest('./static/dist/css'));
});

gulp.task('deal-bower', [
  'deal-bower-js',
  'deal-bower-css'
]);


gulp.task('default', [
  'sass',
  'bower-files',
  'develop',
  'watch'
]);

gulp.task('build', [
  'del:dist',
  'jsLint',
  'deal-js',
  'deal-css',
  'deal-img',
  'deal-html',
  'deal-font',
  'deal-bower'
]);