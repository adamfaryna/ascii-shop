module.exports = function(config) {
  config.set({
    frameworks: ['browserify', 'jasmine', 'sinon'],

    files: [
      'static/bower_components/jquery/dist/jquery.js',
      'static/bower_components/angular/angular.js',
      'static/bower_components/angular-mocks/angular-mocks.js',
      'static/bower_components/angular-route/angular-route.js',
      'static/bower_components/lodash/dist/lodash.js',
      'static/bower_components/moment/moment.js',
      'static/bower_components/react/react.min.js',
      'client/src/js/**/*.js',
      'client/test/**/*.js'
    ],

    exclude: [],

    basePath: './',

    preprocessors: {
      'client/src/js/**/*.js': ['browserify'],
      'client/test/**/*.js': ['browserify']
    },

    reporters: ['progress'],

    port: 9876,

    colors: true,

    logLevel: config.LOG_INFO,

    autoWatch: true,
    singleRun: false,

    // browsers: ['PhantomJS'],
    browsers: ['Chrome'],

    browserify: {
      transform: [
        ['babelify', {
          presets: ['es2015', 'react']
        }]
      ],
      debug: true
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
