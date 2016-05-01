'use strict';

let fs = require('fs');
let path = require('path');
let gulp = require('gulp');
let del = require('del');
let jade = require('gulp-jade');
let babel = require('gulp-babel');
let gutil = require('gulp-util');
let source = require('vinyl-source-stream');
let babelify = require('babelify');
let watchify = require('watchify');
let browserify = require('browserify');
let browserSync = require('browser-sync');
let stylus = require('gulp-stylus');
let nib = require('nib');
let uglify = require('gulp-uglify');
let minifyCSS = require('gulp-minify-css');
let RevAll = require('gulp-rev-all');
let rename = require('gulp-rename');
let awspublish = require('gulp-awspublish');
let glob = require('glob');

// Teardown the tmp directory
gulp.task('teardown', () => {
  return del('build');
});

// Compile Jade templates
let assetPath = (assets, path) => (path) => (assets[path] || path).replace(/^\//, '');

let locals = () => {
  return glob.sync('src/data/*.json').reduce(function(memo, file) {
    let namespace = file.replace('src/data/', '').split('.')[0];
    let data = {};
    try {
      data = JSON.parse(fs.readFileSync(file, 'utf8'));
    } catch(err) {
      // Ignore
    };
    memo[namespace] = data;
    return memo;
  }, {});
};

gulp.task('jade:development', () => {
  return gulp.src('src/html/index.jade')
    .pipe(jade({
      locals: Object.assign(
        { assetPath: assetPath({}) },
        locals()
      )
    }))
    .pipe(gulp.dest('build'));
});

gulp.task('jade:production', () => {
  let manifest = JSON.parse(fs.readFileSync('build/rev-manifest.json', 'utf8'));
  return gulp.src('src/html/index.jade')
    .pipe(jade({
      locals: Object.assign(
        { assetPath: assetPath(manifest) },
        locals()
      )
    }))
    .pipe(gulp.dest('build'));
});

// Compile JavaScript
let bundle, bundler, options, config;

config = {
  entries: ['./src/assets/javascripts/application.js'],
  extensions: ['.js'],
  outputFile: 'application.js',
  outputDir: './build/javascripts'
};

options = Object.assign(
  { entries: config.entries, extensions: config.extensions },
  watchify.args
);

bundler = browserify(options);
bundler.transform(babelify);

bundle = () => {
  return bundler
    .bundle()
    .on('error', function(err) {
      gutil.log(err.message);
      browserSync.notify('Browserify Error!');
      this.emit('end');
    })
    .pipe(source(config.outputFile))
    .pipe(gulp.dest(config.outputDir))
    .pipe(browserSync.stream({ once: true }));
};

let watch = false;

gulp.task('build:js', () => {
  if (watch) {
    bundler = watchify(bundler);
    bundler.on('update', bundle);
    bundler.on('log', gutil.log);
  }
  return bundle();
});

// Compile Stylus => CSS
gulp.task('build:css', () => {
  return gulp.src('./src/assets/stylesheets/application.styl')
    .pipe(stylus({ use: [nib()] }))
    .pipe(gulp.dest('./build/stylesheets'))
    .pipe(browserSync.stream());
});

// Copy over images
gulp.task('build:images', () => {
  return gulp.src('src/assets/images/**/*')
    .pipe(gulp.dest('build/images'));
});

// Minify JavaScript
gulp.task('compress:js', () => {
  return gulp.src('build/javascripts/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('build/javascripts'));
});

// Minify CSS
gulp.task('compress:css', () => {
  return gulp.src('build/stylesheets/*.css')
    .pipe(minifyCSS())
    .pipe(gulp.dest('build/stylesheets'));
});

// Asset revving
gulp.task('rev', () => {
  let revAll = new RevAll();
  return gulp.src([
      'build/stylesheets/application.css',
      'build/javascripts/application.js',
      'build/images/**/*'
    ], { base: path.join(process.cwd(), 'build') })
    .pipe(revAll.revision())
    .pipe(gulp.dest('build'))
    .pipe(revAll.manifestFile())
    .pipe(gulp.dest('build'));
});

gulp.task('rev:clean', gulp.series('rev', () => {
  let manifest, toClean;
  manifest = JSON.parse(fs.readFileSync('build/rev-manifest.json', 'utf8'));
  toClean = Object.keys(manifest).map(function(path) { return 'build/' + path; });
  return del(toClean);
}));

// Configure builds
gulp.task('development:build',
  gulp.series('teardown',
    gulp.parallel(
      'jade:development',
      'build:js',
      'build:css',
      'build:images'
    )
  )
);

gulp.task('production:build',
  gulp.series('teardown',
    gulp.parallel(
      'build:js',
      'build:css',
      'build:images'
    ),
    gulp.parallel(
      'compress:js',
      'compress:css'
    ),
    'rev:clean',
    'jade:production'
  )
);

// Watch
gulp.task('reload', browserSync.reload);

gulp.task('set:watch', (done) => {
  watch = true;
  done();
});

gulp.task('watch', gulp.series('set:watch', 'development:build', (done) => {
  browserSync.init({
    open: false,
    server: { baseDir: 'build' }
  });

  gulp.watch('src/assets/stylesheets/**/*.styl',
    gulp.series('build:css')
  );

  gulp.watch(['src/html/**/*.jade', 'src/data/**/*.json'],
    gulp.series('jade:development', 'reload')
  );

  done();
}));

// Deploy
gulp.task('deploy', gulp.series('production:build', () => {
  let project = process.env.PROJECT_NAME;

  let publisher = awspublish.create({
    accessKeyId: process.env.AWS_KEY,
    secretAccessKey: process.env.AWS_SECRET,
    params: { Bucket: process.env.S3_BUCKET },
    region: process.env.AWS_REGION
  });

  return gulp.src('./build/**/*')
    // Optionally publish to a non-root path
    .pipe(rename(function(path) {
      path.dirname = project + '/' + path.dirname;
    }))
    .pipe(publisher.publish())
    // Optionally delete files in your bucket that are not in your local folder
    .pipe(publisher.sync(project ? (project + '/') : null))
    .pipe(awspublish.gzip({ ext: '.gz' }))
    .pipe(publisher.cache())
    .pipe(awspublish.reporter());
}));
