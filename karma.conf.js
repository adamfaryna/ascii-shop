module.exports = function(config) {
  config.set({
    frameworks: ['browserify', 'jasmine', 'sinon'],

    files: [
      'static/bower_components/jquery/dist/jquery.min.js',
      'static/bower_components/angular/angular.min.js',
      'static/bower_components/angular-mocks/angular-mocks.js',
      'static/bower_components/angular-route/angular-route.min.js',
      'static/bower_components/lodash/dist/lodash.min.js',
      'static/bower_components/moment/min/moment.min.js',
      'static/bower_components/react/react.min.js',
      'client/src/js/**/*.es6',
      'client/test/**/*.es6'
      // 'static/js/app.js'
    ],

    exclude: [],

    basePath: './',

    preprocessors: {
      'client/src/js/**/*.es6': ['babel', 'browserify'],
      'client/test/**/*.es6': ['babel', 'browserify']
    },

    reporters: ['progress'],

    port: 9876,

    colors: true,

    logLevel: config.LOG_INFO,

    autoWatch: true,
    singleRun: false,

    browsers: ['PhantomJS'],
    // browsers: ['Chrome'],
    // browsers: ['Chrome', 'PhantomJS'],

    // browserify: {
    //   transform: [
    //     ['babelify', {
    //       presets: ['es2015', 'react']
    //     }]
    //   ]
    // },

    babelPreprocessor: {
      options: {
        presets: ['es2015', 'react'],
        sourceMap: 'inline'
      },
      filename: function(file) {
        return file.originalPath.replace(/\.es6$/, '.es6.js');
      },
      sourceFileName: function(file) {
        return file.originalPath;
      }
    },

    plugins: [
      'karma-phantomjs-launcher',
      'karma-chrome-launcher',
      'karma-jasmine',
      'karma-browserify',
      'karma-junit-reporter',
      'karma-sinon',
      'karma-babel-preprocessor'
    ]
  });
};
