var gulp = require('gulp'),
	del = require('del'),
	cfg = require('../config');

cfg.project.forEach(function(pro){
	gulp.task('clean:'+ pro.alias,function(cb){
		del([pro.build],cb)
	});
});