'use strict';
  // Импорт плагинов
const gulp = require("gulp");
const sass = require("gulp-sass");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const minify = require("gulp-csso");
const rename = require("gulp-rename");
const webp = require("gulp-webp");
const imagemin = require("gulp-imagemin");
const svgstore = require("gulp-svgstore");
const newname = require("gulp-rename");
const del = require("del");
const posthtml = require("gulp-posthtml");
const include = require("posthtml-include");
const babel = require('gulp-babel');
const server = require("browser-sync").create();

const path = {
  // Местонахождение исходных файлов
  source: {
    sass: 'source/sass/style.scss',
    cssN: 'source/css/normalize.css',
    html: 'source/*.html',
    img: 'source/img/**/*',
    imgR: 'source/img/rast/*',
    imgV: 'source/img/vector/*',
    fonts: 'source/fonts/*',
    js: 'source/js/*',
  },
  // Файлы, за изменениями которых мы будем наблюдать
  watch: {
    sass: 'source/sass/**/*.scss',
    css: 'source/css/style/**/*.css',
    html: 'source/*.html',
  },
};

gulp.task("style", function() {
  const plugins = [
    autoprefixer({overrideBrowserslist: [
      "last 1 version",
      "> 1%",
      "maintained node versions",
      "not dead"
    ]}),
  ];
  return gulp.src(path.source.sass)
    .pipe(sass())
    .pipe(postcss(plugins))
    .pipe(gulp.dest("source/css"))
    .pipe(gulp.dest("build/css"))
    .pipe(minify())
    // .pipe(rename("style.min.css"))
    .pipe(gulp.dest("source/css"))
    .pipe(gulp.dest("build/css"))
    .pipe(server.stream());
});

gulp.task("html", () => {
  return gulp.src(path.source.html)
    .pipe(posthtml([
      include()
    ]))
    .pipe(gulp.dest("build"));
});

gulp.task("sprite", () => {
  return gulp.src(path.source.imgV)
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(newname("sprite.svg"))
    .pipe(gulp.dest("source/img"));
});

gulp.task("images", () => {
  return gulp.src(path.source.img)
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.jpegtran({progressive: true}),
      imagemin.svgo()
    ]))
    .pipe(gulp.dest("source/img"));
});

gulp.task("webp", () => {
  return gulp.src(path.source.imgR)
    .pipe(webp({quality: 90}))
    .pipe(gulp.dest("source/img/rast"));
});

gulp.task("clean", () => {
  return del("build");
});

gulp.task("serve", gulp.series("style", () => {
  server.init({
    server: "source/"
  });
  gulp.watch([path.watch.sass], gulp.series("style"));
  gulp.watch([path.watch.html], gulp.series("html"))
  .on("change", server.reload);
}));

gulp.task("copy", () => {
  return gulp.src([
    path.source.fonts,
    path.source.img,
    path.source.cssN,
  ], {
    base: "source"
  })
  .pipe(gulp.dest("build"));
});

gulp.task('babel', () =>
  gulp.src('source/js/*.js')
    .pipe(babel({
        presets: ['env']
    }))
    .pipe(gulp.dest('build/js/'))
);

gulp.task("build", gulp.series(
  "clean",
  "babel",
  "copy",
  "style",
  "sprite",
  "html",
  )
);
