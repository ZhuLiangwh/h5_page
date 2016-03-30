var gulp    = require('gulp'),                 //基础库
    imagemin = require('gulp-imagemin'),       //图片压缩
    sass = require('gulp-ruby-sass'),          //sass
    minifycss = require('gulp-minify-css'),    //css压缩
    // jshint = require('gulp-jshint'),           //js检查
    uglify  = require('gulp-uglify'),          //js压缩
    rename = require('gulp-rename'),           //重命名
    concat  = require('gulp-concat'),          //合并文件
    clean = require('gulp-clean'),             //清空文件夹
    tinylr = require('tiny-lr'),               //livereload
    server = tinylr(),
    port = 5000,
    livereload = require('gulp-livereload'),  //livereload
    argv = require('yargs').argv,
    replace = require('gulp-replace');

var jsNewDst = argv.build == 'beta' ? './betanewhome/js/':'./emailnewhome/js/',
    htmlNewDst = argv.build == 'beta' ? './betanewhome/':'./emailnewhome/',
    cssNewDst = argv.build =='beta' ? './betanewhome/css':'./emailnewhome/css',
    imgNewDst = argv.build == 'beta' ? './betanewhome/img':'./emailnewhome/img';

// HTML处理
gulp.task('html', function() {
    var htmlSrc = './src/*.html',
        htmlDst = htmlNewDst;

    gulp.src(htmlSrc)
        .pipe(livereload(server))
        .pipe(gulp.dest(htmlDst))
});

// 样式处理
gulp.task('css', function () {
    var cssSrc = './src/css/*',
        cssDst = cssNewDst;

    gulp.src(cssSrc)
        // .pipe(sass({ style: 'expanded'}))
        .pipe(gulp.dest(cssDst))
        // .pipe(rename({ suffix: '.min' }))
        .pipe(minifycss())
        .pipe(livereload(server))
        .pipe(gulp.dest(cssDst));
});

// 图片处理
gulp.task('img', function(){
    var imgSrc = './src/img/**/*',
        imgDst = imgNewDst;
    gulp.src(imgSrc)
        .pipe(imagemin())
        .pipe(livereload(server))
        .pipe(gulp.dest(imgDst));
})

// indexJs处理
gulp.task('indexJs', function () {
    var jsSrc = './src/js/index.js',
        jsDst = jsNewDst;

    gulp.src(jsSrc)
        // .pipe(jshint('.jshintrc'))
        // .pipe(jshint.reporter('default'))
        .pipe(concat('index.js'))
        .pipe(replace(/source\s*\:\s*['"]*[^'"]+['"]*/, 'source:\''+argv.build+'\''))
        .pipe(gulp.dest(jsDst))
        // .pipe(rename({ suffix: '' }))
        .pipe(uglify())
        // .pipe(livereload(server))
        .pipe(gulp.dest(jsDst));
});

// Js处理
gulp.task("copyjs",function(){
    var jsSrc = './src/js/*.js',
        jsDst = jsNewDst;
    gulp.src(jsSrc).pipe(gulp.dest(jsDst));
});

// 清空图片、样式、js
// gulp.task('clean', function() {
//     gulp.src([cssNewDst, jsNewDst, imgNewDst], {read: false})
//         .pipe(clean());
// });

// 默认任务 清空图片、样式、js并重建 运行语句 gulp
// gulp.task('default', ['clean'], function(){
//     gulp.start('html','css','img','copyjs','indexJs');
// });


        
gulp.task('default', function(){
    if(argv.build) {
      var info = argv.build;
      console.log('收到的参数:'+info);
  
      gulp.start('html','css','img','copyjs','indexJs');

    } else {
      console.log('输入错误 请输入 gulp --build beta or email');
    }
});

// 监听任务 运行语句 gulp watch
gulp.task('watch',function(){

    server.listen(port, function(err){
        if (err) {
            return console.log(err);
        }

        // 监听html
        gulp.watch('./src/*.html', function(event){
            gulp.run('html');
        })

        // 监听css
        gulp.watch('./src/css/*.css', function(){
            gulp.run('css');
        });

        // 监听images
        gulp.watch('./src/img/*', function(){
            gulp.run('img');
        });

        // 监听js
        gulp.watch('./src/js/*.js', function(){
            gulp.run('js');
        });

    });
});
