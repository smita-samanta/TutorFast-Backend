import gulp from 'gulp';
import babel from 'gulp-babel';
import uglify from 'gulp-uglify';
import del from 'del';
import { join } from 'path';

const paths = {
  scripts: {
    src: join('src', '**', '*.js'),
    dest: join('lib'),
  },
};

export function scripts() {
  return gulp.src(paths.scripts.src, { sourcemaps: true })
    .pipe(babel())
    .pipe(uglify())
    .pipe(gulp.dest(paths.scripts.dest));
}

const clean = () => del(['lib']);
export { clean };

export const build = gulp.series(clean, scripts);

export default build;
