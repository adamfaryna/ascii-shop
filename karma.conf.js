module.exports = function(config) {
  config.set({
    frameworks: ['browserify', 'jasmine'],

    files: [
      'bower_components/angular/angular.min.js',
      'bower_components/angular-mocks/angular-mocks.js',
      "bower_components/bootstrap/bootstrap.min.js",
      "bower_components/angular-route/angular-route.min.js",
      'client/src/**/*.js'
    ],

    exclude: [],

    basePath: './',

    preprocessors: {
      'client/src/**/*.es6' : ['browserify'],
      'client/test/**/*.es6': ['browserify']
    },

    reporters: ['progress'],

    port: 9876,

    colors: true,

    logLevel: config.LOG_INFO,

    autoWatch: false,
    singleRun: true,

    browsers: ['PhantomJS'],

    browserify: {
      debug: true,
      transform: [
      	['babelify', {
        	presets: ['es2015']
				}]
      ]
    },

    plugins: [
      'karma-phantomjs-launcher',
      'karma-jasmine',
      'karma-browserify'
    ]
  });
};
