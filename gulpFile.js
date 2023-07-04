const { src, dest, watch, series } = require("gulp");
const uglify = require("gulp-uglify");

// CSS y SASS
const sass = require("gulp-sass")(require("sass"));
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const sourcemaps = require("gulp-sourcemaps");
const cssnano = require("cssnano");

// Imagenes
const imagemin = require("gulp-imagemin");
const webp = require("gulp-webp");
const avif = require("gulp-avif");

function css(done) {
  src("src/scss/app.scss")
    .pipe(sourcemaps.init())
    .pipe(sass())
    // .pipe( postcss([ autoprefixer(), cssnano() ]) )
    .pipe(postcss(autoprefixer()))
    .pipe(sourcemaps.write("."))
    .pipe(dest("build/css"));

  done();
}

function imagenes() {
  return src("src/img/**/*")
    .pipe(imagemin({ optimizationLevel: 3 }))
    .pipe(dest("build/img"));
}

function versionWebp() {
  const opciones = {
    quality: 100,
  };
  return src("src/img/**/*.{png,jpg}")
    .pipe(webp(opciones))
    .pipe(dest("build/img"));
}
function versionAvif() {
  const opciones = {
    quality: 100,
  };
  return src("src/img/**/*.{png,jpg}")
    .pipe(avif(opciones))
    .pipe(dest("build/img"));
}

function js() {
  return src("src/js/*.js").pipe(uglify()).pipe(dest("build/js"));
}

function dev() {
  watch("src/scss/**/*.scss", css);
  watch("src/img/**/*", imagenes);
  watch("src/js/**/*.js", js);
}

exports.css = css;
exports.js = js;
exports.dev = dev;
exports.imagenes = imagenes;
exports.versionWebp = versionWebp;
exports.versionAvif = versionAvif;
exports.default = series(imagenes, versionWebp, versionAvif, css, js, dev);
