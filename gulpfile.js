/* пути к исходным файлам (src), к выходным файлам (build), а также к тем, за
изменениями которых нужно наблюдать (watch) */
var path = {
  baseDir: "build/",
  src: {
    html: "src/*.html",
    pages: "src/pug/**/*.pug",
    page: "src/pug/*.pug",
    styles: "src/scss/main.scss",
    scripts: "src/js/",
    img: "src/img/**/*.{png,jpg,svg}",
    webp: "src/img/**/*.{png,jpg}",
    svg: "src/img/svg/**/*.svg",
    fonts: "src/fonts/**/*.*"
  },
  build: {
    html: "build/",
    pages: "build/",
    styles: "build/css/",
    scripts: "build/js/",
    img: "build/img/",
    fonts: "build/fonts/"
  },
  watch: {
    html: "src/*.html",
    pages: "src/pug/**/*.pug",
    styles: "src/scss/**/*.scss",
    scripts: "src/js/**/*.js",
    img: "src/img/**/*.*"
  }
};

// Подключение плагинов
const gulp = require("gulp"); // плагин gulp
const sass = require("gulp-sass"); // плагин для компиляции scss в css
sass.compiler = require("node-sass");
const autoprefixer = require("gulp-autoprefixer"); // плагин для добавления префиксов в css
const cleanCSS = require("gulp-clean-css"); // плагин для минификации css
const sourcemaps = require("gulp-sourcemaps"); // плагин для создания sourcemaps
const concat = require("gulp-concat"); // плагин для обьединения файлов
const uglify = require("gulp-uglify"); // плагин для минификации js
const rename = require("gulp-rename"); // плагин для переименования файлов
const del = require("del"); // плагин для удаления файлов и каталогов
const browserSync = require("browser-sync").create(); // плагин для создания локального сервера
const imagemin = require("gulp-imagemin"); // плагин для минификации изображений
const webp = require("gulp-webp"); // плагин для конвертации png & jpg в webp
const cheerio = require("gulp-cheerio"); // плагин для удаления атрибутов svg
const cache = require("gulp-cache"); // подключаем библиотеку кеширования
const replace = require("gulp-replace");
const svgstore = require("gulp-svgstore"); // плагин для создания svg спрайтов
const svgmin = require("gulp-svgmin"); // плагин для минификации svg
const gulpPosthtml = require("gulp-posthtml");
const include = require("posthtml-include"); // подключает файлы в html
const plaginPug = require("gulp-pug"); // подключает файлы в html

function html() {
  return gulp.src(path.src.html)
    .pipe(gulpPosthtml([include()]))
    .pipe(gulp.dest(path.baseDir))
    .pipe(browserSync.stream());
}
function pug() {
  return gulp.src(path.src.page)
    // .pipe(gulpPosthtml([include()]))
    .pipe(plaginPug({
      pretty: true
    }))
    .pipe(gulp.dest(path.baseDir))
    .pipe(browserSync.stream());
}

// Файлы, которые нужно обработать можно указать через массив
// const cssFiles = [
//   './src/css/nameFiles.css',
//   './src/css/nameFiles2.css'
// ]

// Функция обработки стилей
function styles() {
  return gulp.src(path.src.styles)
    // Инициализируем sourcemaps
    .pipe(sourcemaps.init())
    // Прогоняем через обработчик SASS
    .pipe(sass.sync().on("error", sass.logError))
    // Добавляем префиксы
    .pipe(
      autoprefixer({
        cascade: true
      })
    )
    // Выгружаем файл в папку build/css
    .pipe(gulp.dest(path.build.styles))
    // Минифицируем css
    .pipe(
      cleanCSS({
        level: 2
      })
    )
    // Переименовываем файл добавляя суффикс .min
    .pipe(
      rename({
        suffix: ".min"
      })
    )
    .pipe(sourcemaps.write("./"))
    // Выгружаем в папку build/css
    .pipe(gulp.dest(path.build.styles))
    .pipe(browserSync.stream())
}

// Массив с именами файлов js для обработки
const jsFiles = [path.src.scripts + "lib.js", path.src.scripts + "main.js"];

// Функция обработки скриптов
function scripts() {
  return gulp.src(jsFiles)
    // Инициализация sourcemaps
    .pipe(sourcemaps.init())
    // Объединяем js файлы в один
    .pipe(concat("main.js"))
    // Выгружаем в папку build/js
    .pipe(gulp.dest(path.build.scripts))
    // Минифицируем js
    .pipe(
      uglify({
        // Включить максимальный уроветь минификации
        toplevel: true
      })
    )
    // Переименовываем файл добавляя суффикс .min
    .pipe(
      rename({
        suffix: ".min"
      })
    )
    .pipe(sourcemaps.write("./"))
    // Выгружаем в папку build/js
    .pipe(gulp.dest(path.build.scripts))
    .pipe(browserSync.stream())
}

// Оптимизация (сжатие) изображение
function imgCompress() {
  return gulp.src(path.src.img)
    .pipe(
      cache(
        // Минифицируем изображения
        imagemin([
          imagemin.gifsicle({
            interlaced: true
          }),
          imagemin.mozjpeg({
            quality: 75,
            progressive: true
          }),
          imagemin.optipng({
            optimizationLevel: 3 // безопасное сжатие
          }),
          imagemin.svgo()
        ])
      )
    )
    .pipe(gulp.dest(path.build.img)); // выгружаем минифицированные изображения в build/img
}

// создаем версии изображений в формате WebP
function webpImg() {
  return gulp
    .src(path.src.webp)
    .pipe(
      webp({
        quality: 90
      })
    )
    .pipe(gulp.dest(path.build.img));
}

function svg() {
  return (
    gulp
    .src(path.src.svg) // указываем путь к svg файлам
    .pipe(
      svgmin({
        plugins: [{
          removeViewBox: false
        }]
      })
    ) // минимизируем svg перед созданием спрайта
    .pipe(
      cheerio({
        run: function ($) {
          $("[fill]").removeAttr("fill");
          $("[stroke]").removeAttr("stroke");
          $("[style]").removeAttr("style");
        },
        parserOptions: {
          xmlMode: true
        }
      })
    )
    // .pipe(replace('&gt;', '>'))
    .pipe(
      svgstore({
        // создаем спрайт
        inlineSvg: true // уберет из файла все не нужное (doctype, xml и прочее)
      })
    )
    .pipe(rename("sprite.svg")) // перименовываем svg
    .pipe(gulp.dest(path.build.img))
  ); // выгружаем в папку build/img
}

function watch() {
  browserSync.init({
    server: {
      baseDir: path.baseDir,
    }
    // tunnel: true
  });
  // Наблюдение за html файлами
  // gulp.watch(path.watch.html, html);
  gulp.watch(path.watch.pages, pug);
  // Наблюдение за scss файлами
  gulp.watch(path.watch.styles, styles);
  // Наблюдение за js файлами
  gulp.watch(path.watch.scripts, scripts);
  // Наблюдение за изображениями
  gulp.watch(path.watch.img, gulp.series(imgCompress, webpImg));
}

function copy() {
  return gulp
    .src([path.src.fonts, path.src.img], {
      base: "src"
    })
    .pipe(gulp.dest(path.baseDir));
}

function clean() {
  return del(path.baseDir);
}

function clearCache() {
  return cache.clearAll();
}

gulp.task('pilot', function () {
  return gulp.src([
      'node_modules/slick-carousel/slick/slick.js',
      'node_modules/@fancyapps/fancybox/dist/jquery.fancybox.js',
      'node_modules/jquery-form-styler/dist/jquery.formstyler.js',
      'node_modules/wow.js/dist/wow.js',
      'node_modules/rateyo/min/jquery.rateyo.min.js',
    ])
    .pipe(concat('libs.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('build/js'))
});

gulp.task('samolet', function () {
  return gulp.src([
      'node_modules/normalize.css/normalize.css',
      'node_modules/slick-carousel/slick/slick.css',
      'node_modules/slick-carousel/slick/slick-theme.css',
      'node_modules/@fancyapps/fancybox/dist/jquery.fancybox.css',
      'node_modules/jquery-form-styler/dist/jquery.formstyler.css',
      'node_modules/jquery-form-styler/dist/jquery.formstyler.theme.css',
      'node_modules/animate.css/animate.css',
      'node_modules/rateyo/min/jquery.rateyo.min.css',
    ])
    .pipe(concat('libs.min.css'))
    .pipe(cleanCSS())
    .pipe(gulp.dest('build/css'))
});

gulp.task("copy", copy);
gulp.task("html", html);
gulp.task("pug", pug);
gulp.task("styles", styles);
gulp.task("scripts", scripts);
gulp.task("imgCompress", imgCompress);
gulp.task("webpImg", webpImg);
gulp.task("svg", svg);
gulp.task("watch", watch);
gulp.task("clean", clean);
gulp.task("clearCache", clearCache);

gulp.task(
  "build",
  gulp.series(clean, copy, gulp.parallel(styles, scripts, pug), imgCompress, webpImg, svg, 'pilot', 'samolet')
);
// gulp.series -  запускает задачи последовательно
// gulp.parallel -  запускает задачи ассинхронно (две задачи выполняются паралельно)

gulp.task("dev", gulp.series("build", "watch"));
