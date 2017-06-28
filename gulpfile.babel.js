import gulp from 'gulp';
import babel from 'gulp-babel';
import uglify from 'gulp-uglify';
import newer from 'gulp-newer';
import del from 'del';
import nodemon from 'gulp-nodemon';
import { join } from 'path';

const paths = {
  scripts: {
    src: join('src', '**', '*.js'),
    dest: join('lib'),
  },
};

export function scripts() {
  return gulp.src(paths.scripts.src, { sourcemaps: true })
    .pipe(newer(paths.scripts.dest))
    .pipe(babel())
    .pipe(uglify())
    .pipe(gulp.dest(paths.scripts.dest));
}

const clean = () => del(['lib']);
export { clean };

export function watchScripts() {
  return gulp.watch(paths.scripts.src, scripts);
}

export function watchLib(done) {
  nodemon({
    script: 'lib',
    watch: 'lib/',
  });

  done();
}

export const build = gulp.series(clean, scripts);

export const dev =
  gulp.series(
    build,
    gulp.parallel(
      watchScripts,
      watchLib,
    ),
  );

export default build;
