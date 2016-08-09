module.exports = function(config) {
  config.set({
    frameworks: ['browserify', 'jasmine', 'sinon'],

    files: [
      'static/bower_components/angular/angular.min.js',
      'static/bower_components/react/react.min.js',
      'static/bower_components/angular-mocks/angular-mocks.js',
      // 'static/js/**/*.js'
      'client/src/js/**/*.es6',
      'client/test/**/*.es6'
    ],

    exclude: [],

    basePath: './',

    preprocessors: {
      'client/src/js/**/*.es6': ['browserify'],
      'client/test/**/*.es6': ['browserify']
    },

    reporters: ['progress'],

    port: 9876,

    colors: true,

    logLevel: config.LOG_DEBUG,

    autoWatch: false,
    singleRun: true,

    browsers: ['PhantomJS'],
    // browsers: ['Chrome', 'PhantomJS'],

    browserify: {
      debug: true,
      transform: [
        ['babelify', {
          presets: ['es2015', 'react']
        }]
      ]
    },

    plugins: [
      'karma-phantomjs-launcher',
      'karma-chrome-launcher',
      'karma-jasmine',
      'karma-browserify',
      'karma-junit-reporter',
      'karma-sinon'
    ]
  });
};
