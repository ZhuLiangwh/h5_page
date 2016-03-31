var gulp = require('gulp'),
	sequence = require('run-sequence'),
	cfg = require('../config');

var proTask = [];

gulp.task('build',function(){
	sequence.apply(null,proTask);	
});

//build 单个项目
cfg.project.forEach(function(pro){
	gulp.task('build:'+pro.alias,function(){
		// sequence('clean:'+ pro.alias,'requirejs:'+ pro.alias,'sass:'+ pro.alias,'copy:'+ pro.alias);
		sequence('clean:'+ pro.alias,'copy:'+ pro.alias);
	});

	proTask.push('build:'+pro.alias);
});