var gulp = require('gulp'),
		path  = require('path');

var config = require('./config');
var websGenPath = './web_generator/';
var websSrcPath = './webs/';

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
		// .pipe(livereload());
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


// plumber = require('gulp-plumber'),
// livereload && nodemon ---------------

var nodemon = require('gulp-nodemon'),
		livereload = require('gulp-livereload');
// 需要配合插件：https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei


gulp.task('watch', function() {
	gulp.watch('./static/src/sass/', ['sass']);
	gulp.watch('./static/**/*.*', function(file){
		livereload.reload();
		// livereload.changed(file.path);
	});
});

gulp.task('develop', function () {
	livereload.listen({
		reloadPage: config.app.host+':'+config.app.port
	});
	nodemon({
		script: 'app.js'
		// ext: 'js coffee ejs',
	}).on('restart', function () {
		setTimeout(function () {
			livereload.changed();
		}, 500);
	});
});

// 

/*
 * 依据web_generator模板 创建相应的web服务;
 */
var fs = require('fs'),
		inquirer = require("inquirer");
var ui = new inquirer.ui.BottomBar();

gulp.task('create', function(){
	// pipe a Stream to the log zone
	ui.log.write("开始创建新的web服务=>");
	return inquirer.prompt([{name: 'appName', message: '请输入webApp的名称: ', type: 'input'}, 
					 {name: 'appHost', message: '请输入app的域名: ', type: 'input'},  
					 {name: 'appPort', message: '请输入端口: ', type: 'input'},
					 {name: 'appFePath',  message: '请输入webApp的前端路径: ', type: 'input'}],  handleAnswers);


	function handleAnswers( answers ) {
		var configStr = fs.readFileSync(websGenPath + 'config.js').toString();
		var webStr = fs.readFileSync(websGenPath + 'web.js').toString();
		var resStr = configStr.replace(/{{(\w+)}}/g, function(item, $1){
					return answers[$1];
				});	
		var setWebs = function(exist){
			var createDirPath = websSrcPath+answers.appName;
			if(!exist){
				fs.mkdirSync(createDirPath);
			}
			fs.writeFile(createDirPath+'/config.js', resStr, function (err) {});
			fs.writeFile(createDirPath+'/'+answers.appName + '.js', webStr, function (err) {});
			console.log('恭喜，已创建完毕，配置文件生成于'+ websGenPath + answers.appName +'目录,可运行 gulp ' + answers.appName + ' 运行！');
		};

		//如果有同名则提示
		fs.readdir(websSrcPath, function(err, files){
			if(!!~files.indexOf(answers.appName)){
				inquirer.prompt([{message:'已经有同名的项目了，请确认是否覆盖?', type: 'confirm', name: 'rewrite'}], function (answers) {
					if(!answers.rewrite) return;
					setWebs(1);
				});
			}else{
				setWebs(0);
			}        
		});
	}
});

//为多web服务提供gulp nodemon && livereload功能，注册相应gulp Task
function regWebsRun(websName){
	console.log(websName, 'websName');
	var specWebItem = './webs/'+websName+'/';
	try{
		var specWebConf = require(specWebItem + 'config');
		//读取相应前端目录并监听改变
		console.log('watch相关的目录有：' + path.normalize(specWebConf.path.fe + '**/*.*'));
		gulp.watch(path.normalize(specWebConf.path.fe + '**/*.*'), function(file){
			livereload.reload();
		});
	}catch(e){
		return;
	}

	gulp.task(websName, function () {

		livereload.listen({
			reloadPage: specWebConf.app.host+':'+specWebConf.app.port
		});
		nodemon({
			script: specWebItem + websName + '.js'
			// ext: 'js coffee ejs',
		}).on('restart', function () {
			setTimeout(function () {
				livereload.changed();
			}, 500);
		});
	});
}

//读取子web并注册相应任务

gulp.task('update', function(cb){
	var fileStr = fs.readFileSync('gulpfile.js').toString().replace(/regWebsRun\([^)|+]*\);/g, '');
	fs.writeFile('gulpfile.js', fileStr, function (err) {
		fs.readdir(websSrcPath, function(err, files){
			for(var i=0; i<files.length; i++){
				//如果不存在则追加
				if(/^\w+$/.test(files[i])){
				 fs.appendFileSync('gulpfile.js', 'regWebsRun("'+files[i]+'");');
				}
			}
			cb();
		});
	});
});

gulp.task('default', [
	'sass',
	'bower-files',
	'develop',
	'watch'
]);

gulp.task('build', [
	// 'del:dist',
	'jsLint',
	'deal-js',
	'deal-css',
	'deal-img',
	'deal-html',
	'deal-font',
	'deal-bower'
]);
regWebsRun("corajs");regWebsRun("ctripweb");regWebsRun("h5share");regWebsRun("web1");regWebsRun("webn");regWebsRun("youWebName");