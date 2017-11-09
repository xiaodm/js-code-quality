/**!
 * gulpfile.js
 *
 */

'use strict';

/**
 * Module dependencies.
 */
const
	gulp = require('gulp'),
	$ = require('gulp-load-plugins')(),
	runSequence = require('run-sequence').use(gulp),
	exec = require('child_process').exec,
    istanbul = require('gulp-istanbul');

const paths = {
	app: './src/client/',
	css: {
		files: ['src/client/css/*.css']
	},
	js: {
		files: ['src/client/js/*.js']
	},
	external_js: ['src/client/js/plugin*/**', 'src/client/js/lib*/**'], 
	assets: ['src/client/*.txt', 'src/client/*.xml', 'src/client/img*/**', 'src/client/static*/**'], 
	dest: 'dist/',
	// dest: 'archive/release/dist/',
	release: 'archive/TestNodeServer/',
	archive: 'archive/',
	views: './src/server/view/**/*.ejs'
};

//拷贝commit-msg
gulp.task('copy-git-hooks', function () {
	return gulp.src('git_hook/*')
		.pipe(gulp.dest('./.git/hooks'));
});

//拷贝依赖的js库
gulp.task('copy-external-js', function () {
	return gulp.src(paths.external_js)
		.pipe(gulp.dest(paths.dest + 'public/js'));
});

//拷贝静态资源文件
gulp.task('copy-assets', function () {
	return gulp.src(paths.assets)
		.pipe(gulp.dest(paths.dest + 'public'));
});

//压缩混淆js
gulp.task('uglify-js', function () {
	return gulp.src(paths.js.files, {base: 'src/client'})
		.pipe($.uglify())
		.pipe($.rev())
		.pipe(gulp.dest(paths.dest + 'public'))
		.pipe($.rev.manifest())
		.pipe(gulp.dest(paths.dest + 'rev/rev1/'));
});

//压缩CSS
gulp.task('minify-css', function () {
	return gulp.src(paths.css.files, {base: 'src/client'})
		.pipe($.minifyCss())
		.pipe($.rev())
		.pipe(gulp.dest(paths.dest + 'public'))
		.pipe($.rev.manifest())
		.pipe(gulp.dest(paths.dest + 'rev/rev2/'));
});


//替换静态资源文件引用路径
gulp.task('add-revision', function () {
	return gulp.src(['./dist/rev/**/*.json', './src/server/view/**/*.ejs'])
		.pipe($.revCollector())
		.pipe(gulp.dest(paths.dest + 'views'));
});

gulp.task('add-revision-to-html', function () {
	return gulp.src(['./dist/rev/**/*.json', 'src/client/*.html'])
		.pipe($.revCollector())
		.pipe(gulp.dest(paths.dest + "public"));
});

//删除构建后的文件夹
gulp.task('clean', function () {
	return gulp.src([paths.dest], {read: false})
		.pipe($.clean());
});

//删除发布后的文件夹
gulp.task('clean-release', function () {
	return gulp.src([paths.archive], {read: false})
		.pipe($.clean());
});

//检查js代码质量
gulp.task('lint', function () {
	return gulp.src('./**/*.js')
		.pipe($.eslint())
		.pipe($.eslint.format())
		.pipe($.eslint.failAfterError())
		.pipe(gulp.dest(paths.dest + 'public/js'));
});


//单元测试mocha
/*
gulp.task('mtest', function () {
	return gulp.src('test', {read: false})
		.pipe($.mocha({
			"recursive":true,
			"exit":true,
			"reporter": "mocha-jenkins-reporter",
			"reporterOptions": {
				"junit_report_name": "Tests",
				"junit_report_path": "report.xml",
				"junit_report_stack": 1,
				"JENKINS_REPORTER_ENABLE_SONAR":true,
				"JENKINS_REPORTER_TEST_DIR":"src/test"
			}
		}))
});
*/

//单元测试mocha
gulp.task('mtest', ['pre-test'], function () {
	return gulp.src(['test/controller/*.js'], {read: false})
		.pipe($.mocha({
			"recursive":true,
			"exit":true,
			"reporter": "mocha-sonar-generic-test-coverage",
			"reporterOptions": {
				"outputFile": "./report/report.xml",
				"useFileFullPath": false
			}
		}))
		.once('error', (e) => {
			console.log(e);
			process.exit(1);
		})
		// Creating the reports after tests ran
		.pipe(istanbul.writeReports({
			dir: './report/coverage',
		}))
		// Enforce a coverage of at least 90%
		.pipe(istanbul.enforceThresholds({ thresholds: { global: 1.6 } }))
		.once('end', function () {
			process.exit();
		});
});

gulp.task('pre-test',['clean-report'], function () {
	return gulp.src(['./src/server/controller/*.js'])
	// Covering files
		.pipe(istanbul())
		// Force `require` to return covered files
		.pipe(istanbul.hookRequire());
});

gulp.task('clean-report', function () {
	return gulp.src('report/*', {read: false})
		.pipe($.clean({force: true}));
});


//拷贝后端Node文件
gulp.task('copy-server-side-files', function () {
	return gulp.src(['index.js', 'package.json', 'src*/server*/**'])
		.pipe(gulp.dest(paths.release));
});

//拷贝前端资源文件
gulp.task('copy-client-side-files',function(){
	return gulp.src('dist*/**')
		.pipe(gulp.dest(paths.release));
});

//安装依赖
gulp.task('install-deps',function(cb){
	console.info('installing dependencies...');
	exec('cd archive/TestNodeServer && npm install --production',function(err,stdout,stderr){
		if(err) throw err;
		if(stdout) console.info(stdout);
		if(stderr) console.info(stderr);
		cb();
	});
});

//打包需要发布的文件
gulp.task('package',function(){
	return gulp.src('archive/TestNodeServer*/**')
		.pipe($.tar('TestNodeServer.tar'))
		.pipe($.gzip())
		.pipe(gulp.dest(paths.archive));
});

gulp.task('release',function(){
	runSequence(
		'clean-release',
		'build',
		'copy-client-side-files',
		'copy-server-side-files',
		'install-deps'
	);
});

//监控文件的变化
gulp.task('watch', function () {
	gulp.watch(paths.js.files, ['uglify-js']);
	gulp.watch(paths.css.files, ['minify-css']);
	gulp.watch(paths.assets, ['copy-assets']);
	gulp.watch(paths.external_js, ['copy-external-js']);
});

//启动服务器
gulp.task('server', function () {
	nodemonServerInit();
});

//进入开发环境
gulp.task('dev', function () {
	runSequence(
		// 'lint',
		'uglify-js',
		'minify-css',
		'copy-assets',
		'copy-external-js',
		'watch'
	);
});

//生产环境客户端资源文件Build
gulp.task('build', function (cb) {
	runSequence(
		'clean',
		'uglify-js',
		'minify-css',
		'copy-assets',
		'copy-external-js',
		'add-revision',
		'add-revision-to-html',
		'copy-git-hooks',
		'mtest',
		cb
	);
});

//默认任务
gulp.task('default', ['dev']);


function nodemonServerInit() {
	$.livereload.listen();

	return $.nodemon({
		script: 'index.js',
		ext: 'js,ejs',
		ignore: [
			'src/client',
			'public',
			'test',
			'dist'
		]
	});
}
