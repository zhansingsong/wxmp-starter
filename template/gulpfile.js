// 参考： https://github.com/mcc108/mp-gulpfile
// https://github.com/MaelWeb/gulp-wechat-weapp-src-alisa#readme
const path = require('path');
const gulp = require('gulp');
const sass = require('sass');
const del = require('del');
// https://github.com/yingye/postcss-px2units/blob/master/README_CN.md
const autoprefixer = require('autoprefixer');
const px2units = require('postcss-px2units');
const cssnano = require('cssnano');
const svg2font = require('@zhansingsong/svg2font');
const ci = require('miniprogram-ci');

const currentEnv = process.env.NODE_ENV;
const gulpPlugins = require('gulp-load-plugins')();

const jsonfile = require('jsonfile');

const resolve = (...args) => path.resolve(__dirname, ...args);

// config
const config = {
  src: 'src',
  dist: 'miniprogram_dist',
  alias: {
    paths: {
      '@': path.join(__dirname, 'src'),
      '@styles': path.join(__dirname, 'src', 'styles'),
      '@assets': path.join(__dirname, 'src', 'assets'),
      '@font': path.join(__dirname, 'src', 'font'),
    },
  },
  sourcemap: currentEnv === 'development',
};

// 文件匹配路径
const globs = {
  ts: `${config.src}/**/*.{ts, tsx}`, // 匹配 ts 文件
  scss: `${config.src}/**/*.scss`, // 匹配 scss 文件
  font: `${config.src}/font/svg2font/**`, // 匹配 scss 文件
  wxml: `${config.src}/**/*.wxml`, // 匹配 wxml 文件
  image: `${config.src}/**/*.{png,jpg,jpeg,gif,svg}`, // 匹配 image 文件
  typings: `${config.src}/typings/**`, // 声明文件
};
globs.copy = [
  `${config.src}/**`,
  `!${globs.ts}`,
  `!${globs.js}`,
  `!${globs.scss}`,
  `!${globs.wxml}`,
  `!${globs.image}`,
  `!${globs.typings}`,
  `!${config.src}/font/svg2font`,
  `!${config.src}/styles`,
];

const clearCache = () => gulpPlugins.cache.clearAll();

const clear = () => del(config.dist, { dot: true });

const ts = () => {
  const tsProject = gulpPlugins.typescript.createProject('tsconfig.json');
  return (
    tsProject
      .src()
      // .pipe(gulpPlugins.changed(config.dist))
      .pipe(gulpPlugins.newer(config.dist))
      .pipe(gulpPlugins.if(config.sourcemap, gulpPlugins.sourcemaps.init()))
      .pipe(gulpPlugins.pathAlias(config.alias))
      .pipe(tsProject())
      .js.pipe(gulpPlugins.if(config.sourcemap, gulpPlugins.sourcemaps.write('.')))
      .pipe(gulpPlugins.size({ title: '脚本' }))
      .pipe(gulp.dest(config.dist))
  );
};

const style = () => {
  const plugins = [autoprefixer(), px2units()];
  if (currentEnv !== 'development') {
    plugins.push(cssnano());
  }
  const sassPlugin = gulpPlugins.sass(sass);
  return (
    gulp
      .src([globs.scss, `!${config.src}/styles/*.scss`, `!${config.src}/font/*.scss`])
      // 插入公共样式
      .pipe(gulpPlugins.header(['/* inject:scss */', '/* endinject */'].join('\n')))
      .pipe(
        gulpPlugins.inject(gulp.src([`${config.src}/styles/index.scss`], { read: false }), {
          relative: true,
          removeTags: true,
          transform: function (filepath) {
            return `@use "${filepath}" as *;\n`;
            // Use the default transform as fallback:
            // return gulpPlugins.inject.transform.apply(gulpPlugins.inject.transform, arguments);
          },
        })
      )
      // .pipe(gulpPlugins.changed(config.dist))
      // .pipe(gulpPlugins.newer(config.dist))
      .pipe(gulpPlugins.if(config.sourcemap, gulpPlugins.sourcemaps.init()))
      .pipe(gulpPlugins.pathAlias(config.alias))
      .pipe(sassPlugin({ includePaths: ['node_modules'] }).on('error', sassPlugin.logError))
      .pipe(gulpPlugins.postcss(plugins))
      // https://github.com/gulp-sourcemaps/gulp-sourcemaps/issues/60
      // .pipe(sourcemaps.write({ includeContent: false }))
      // .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(
        gulpPlugins.rename(function (path) {
          path.extname = '.wxss';
        })
      )
      .pipe(gulpPlugins.if(config.sourcemap, gulpPlugins.sourcemaps.write('.')))
      .pipe(gulpPlugins.size({ title: '样式' }))
      .pipe(gulp.dest(config.dist))
  );
};

const lint = () => {
  return (
    gulp
      .src([globs.ts, `!${globs.typings}`])
      // eslint() attaches the lint output to the "eslint" property
      // of the file object so it can be used by other modules.
      .pipe(gulpPlugins.eslint())
      // eslint.format() outputs the lint results to the console.
      // Alternatively use eslint.formatEach() (see Docs).
      .pipe(gulpPlugins.eslint.format())
      // To have the process exit with an error code (1) on
      // lint error, return the stream and pipe to failAfterError last.
      .pipe(gulpPlugins.eslint.failAfterError())
  );
};
const font = (cb) => {
  svg2font({
    // svgs 路径，https://github.com/isaacs/node-glob
    svgPath: path.join(__dirname, 'src', 'font', 'svg2font', '*.svg'),
    // 输出 css 文件名
    cssFileName: 'iconfont.scss',
    // 字体名
    fontName: 'iconfont',
    // 引用 icon 类名的前缀
    iconClassPrefix: 'icon',
    // 基类名
    baseClass: 'iconfont',
    // 字体和 css 文件输出目录
    // outputPath: 'output',
    outputPath: {
      font: 'src/font/iconfont',
      css: 'src/font',
    },
    // css 中字体的引用路径
    stylePath: './font/iconfont',
    // 设置伪类
    pseudo: 'before',
    append: false,
  });
  cb();
};
const wxml = () => {
  return gulp
    .src([globs.wxml])
    .pipe(gulpPlugins.changed(config.dist))
    .pipe(gulpPlugins.pathAlias(config.alias))
    .pipe(gulpPlugins.size({ title: 'wxml' }))
    .pipe(gulp.dest(config.dist));
};

const image = () => {
  return gulp
    .src([globs.image, `!${config.src}/font/svg2font/*.svg`])
    .pipe(gulpPlugins.changed(config.dist))
    .pipe(
      gulpPlugins.imagemin({
        progressive: true,
        interlaced: true,
      })
    )
    .pipe(gulpPlugins.size({ title: '图片' }))
    .pipe(gulp.dest(config.dist));
};

const copy = () => {
  return gulp
    .src(globs.copy)
    .pipe(gulpPlugins.size({ title: '拷贝' }))
    .pipe(gulp.dest(config.dist));
};
const libwxss = () => {
  return gulp
    .src(['node_modules/weui-miniprogram/miniprogram_dist/weui-wxss/dist/style/weui.wxss'], { base: './', allowEmpty: true })
    .pipe(gulpPlugins.rename({ extname: '.css' }))
    .pipe(gulp.dest('.'));
};

const npm = () => {
  return ci.packNpmManually({
    packageJsonPath: './package.json',
    miniprogramNpmDistDir: './miniprogram_dist/',
  });
};
// 将 miniprogramRoot 配置修改为 dist 路径
const mconfig = async () => {
  const projectFile = resolve('project.config.json');
  const project = jsonfile.readFileSync(projectFile, { throws: false });
  if (project) {
    project.miniprogramRoot = path.relative(path.dirname(projectFile), config.dist);
    jsonfile.writeFileSync(resolve('project.config.json'), project, { spaces: 2 });
    project.miniprogramRoot = '/';
    jsonfile.writeFileSync(resolve(config.dist, 'project.config.json'), project, { spaces: 2 });
  }
};

const watch = () => {
  gulp.watch(globs.copy, copy);
  gulp.watch(globs.ts, gulp.series(lint, ts));
  gulp.watch(globs.font, font);
  gulp.watch(globs.scss, style);
  gulp.watch(globs.wxml, wxml);
  gulp.watch(globs.image, image);
  gulp.watch('./package-lock.json', {events: ['change']}, npm);
};

const dev = gulp.series(
  gulp.parallel(clear, clearCache),
  font,
  gulp.parallel(copy, npm, image, wxml, gulp.series(lint, ts), style, libwxss),
  mconfig,
  watch
);
const build = gulp.series(clear, font, gulp.parallel(copy, npm, image, wxml, gulp.series(lint, ts), style, libwxss), mconfig);

module.exports = {
  image,
  copy,
  wxml,
  lint,
  ts,
  font,
  mconfig,
  libwxss,
  npm,
  style,
  clear,
  watch,
  build,
  default: dev,
};
