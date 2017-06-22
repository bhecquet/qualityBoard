var gulp  = require('gulp');
var mocha = require('gulp-mocha');
var istanbul = require('gulp-istanbul');

gulp.task('coverage', function(){
	console.log('coverage...');
	//return gulp.src('packages/**/jobs/**/!(test)*.js')
	return gulp.src(['packages/**/jobs/*.js','packages/**/jobs/**/!(test)*.js'])
	.pipe(istanbul()).pipe(istanbul.hookRequire());
});

gulp.task('test',['coverage'], function(){
	console.log("Tests back-end ...");
	return gulp.src('packages/**/jobs/**/test/*.js')
	.pipe(istanbul({includeUntested : true}))
	.pipe(mocha({reporter: 'spec'}))
	.pipe(istanbul.writeReports());
});

gulp.task('watch', function(){
	var watcher = gulp.watch(['packages/**/jobs/**/*.js', 'packages/**/widgets/**/*.js'], ['test']);
	watcher.on('change', function(event){
		console.log('File ' + event.path + ' was ' + event.type + ', running tests...')
	});
});