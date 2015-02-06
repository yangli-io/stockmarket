/* jshint ignore:start */
var gulp    = require('gulp'),
    sass    = require('gulp-ruby-sass'),
    jade    = require('gulp-jade'),
    copy    = require('gulp-copy'),
    del     = require('del'),
    concat  = require('gulp-concat'),
    filter  = require('gulp-filter'),
    server  = require('gulp-develop-server'),
    template= require('gulp-angular-templatecache'),
    reload  = require('gulp-livereload');

var start = false;

gulp.task('jade',['clean'], function(){
   return gulp.src('./dev/index.jade')
       .pipe(jade({
           pretty: true
       }))
       .pipe(gulp.dest('./www'))
       .pipe(reload());
});

gulp.task('clean', function(cb){
    if (start) {
        return cb();
    }
    del(['www/**'], cb);
});

gulp.task('copy-libraries', ['clean'], function(){
    return gulp.src('bower_components/**')
        .pipe(filter(['**/angular-bootstrap/*tpls.min.js', '**/angular/*.min.js', '**/ui-router/release/*.min.js']))
        .pipe(concat('libraries.js'))
        .pipe(gulp.dest('www/js'));
});

gulp.task('copy-js', ['clean'], function(){
    return gulp.src('dev/js/**/*.js')
        .pipe(concat('app.js'))
        .pipe(gulp.dest('www/js'))
        .pipe(reload());
});

gulp.task('copy-css', ['clean'], function(){
    return gulp.src('bower_components/bootstrap/dist/**')
        .pipe(gulp.dest('www/css/bootstrap'));
});

gulp.task('server', function() {
    server.listen({ path: './app.js' } );
});

gulp.task('angular-templates', ['clean'], function(){
    return gulp.src('dev/partials/*.jade')
        .pipe(jade())
        .pipe(template('templates.js', {module: 'stocks'}))
        .pipe(gulp.dest('www/js'))
        .pipe(reload());
});

gulp.task('sass', ['clean'], function(){
    return sass('dev/sass/style.sass')
        .pipe(gulp.dest('www/css/'))
        .pipe(reload());
});

reload({ start: true });

gulp.task('default', ['jade', 'copy-libraries', 'copy-js', 'copy-css', 'angular-templates', 'sass', 'server'], function(){
    start = true;
    reload.listen();
    gulp.watch('dev/js/**/*.js', ['copy-js']);
    gulp.watch('dev/**/*.jade', ['jade']);
    gulp.watch('dev/partials/*.jade', ['angular-templates']);
    gulp.watch('dev/sass/**/*.sass', ['sass']);
    gulp.watch('./app.js', server.restart);
});