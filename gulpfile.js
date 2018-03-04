var gulp = require('gulp');
var browserSync = require('browser-sync');
var sass = require('gulp-sass');

gulp.task('reload', function(){
    browserSync.reload();
});

gulp.task('serve', ['sass'], function(){
    browserSync({
        server: 'src'
    });

    gulp.watch('src/*.html', ['reload']);
    gulp.watch('src/**/*.scss', ['sass']);
    gulp.watch('src/*.js', ['reload']);
});

gulp.task('sass', function(){
    return gulp.src('src/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('src'))
    .pipe(browserSync.stream());
});

gulp.task('default', ['serve']);