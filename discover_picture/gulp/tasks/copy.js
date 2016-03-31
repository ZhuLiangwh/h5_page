var gulp = require('gulp'),
	cfg = require('../config');

cfg.project.forEach(function(pro){
	var name = pro.alias, 
		src = pro.src,
		build = pro.build,
		taskHtml = 'copy:'+name+'_html',
		taskCss = 'copy:'+name+'_css',
		taskImg = 'copy:'+name+'_img',
		taskVendors = 'copy:'+name+'_vendors',
		taskBoot = 'copy:'+name+'_boot';

	/*==copy html==*/
	gulp.task(taskHtml,function(){
		return gulp.src([src+'*.html'],{base:src})
				.pipe(gulp.dest(build));
	});

	/*==copy css==*/
	gulp.task(taskCss,function(){
		return gulp.src(src+'css/**',{base:src})
				.pipe(gulp.dest(build));
	});
	
	/*==copy img==*/
	gulp.task(taskImg,function(){
		return gulp.src(src+'img/**',{base:src})
				.pipe(gulp.dest(build));
	});

	/*==copy vendors==*/
	gulp.task(taskVendors,function(){
		var vendors = cfg.getVendors(pro);

		return gulp.src(vendors,{base:src})
				.pipe(gulp.dest(build));
	});

	/*==copy boot==*/
	gulp.task(taskBoot,function(){
		return gulp.src(src+'index.js')
				.pipe(gulp.dest(build));
	});

	gulp.task('copy:'+ name,[taskHtml,taskCss,taskImg,taskVendors,taskBoot]);

});










