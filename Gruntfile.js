module.exports = function(grunt) {
	'use strict';

	require('jit-grunt')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    browserify: {
      dist: {
        options: {
          transform: [
	         ['babelify', {
	           presets: ['es2015']
	         }],
           ['reactify'],
	         ['uglifyify']
          ]
        },
        files: {
          'static/js/app.min.js' : 'client/src/**/*.es6'
        }
      },
      dev: {
        options: {
          transform: [
            ['babelify', {
              presets: ['es2015']
            }],
            ['reactify']
          ],
          browserifyOptions: {
            debug: true
          }
        },
        files: {
          'static/js/app.js' : 'client/src/**/*.es6'
        }
      }
    },

    copy: {
      all: {
        files: [{
          expand: true,
          cwd: 'client/src/',
          src: ['partials/**', 'index.html'],
          dest: 'static/'
        }]
      }
    },

    wiredep: {
      task: {
        src: [ 'static/index.html']
      }
    },

    injector: {
      options: {
        template: 'static/index.html',
        addRootSlash: false,
        relative: true
      },
      dist: {
        files: {
          'static/index.html': [
            'static/js/external.min.*.js',
            'static/js/app.min.*.js',
            'static/css/*.min.*.css'
          ]
        }
      },
      dev: {
        files: {
          'static/index.html': [
            'static/js/app.js',
            'static/css/style.css'
          ]
        }
      }
    },

    less: {
      options: {
        paths: ['static/bower_components/bootstrap/less'],
      },
      dist: {
        options: {
          outputStyle: 'compressed'
        },
        files: {
          'static/css/style.min.css': 'client/src/less/style.less'
        }
      },
      dev: {
        options: {
          sourceMap: true
        },
        files: {
          'static/css/style.css': 'client/src/less/style.less'
        }
      }
    },

    autoprefixer: {
      options: {
        browsers: ['last 2 versions', 'ie 8', 'ie 9']
      },
      dist:{
        files:{
          'static/css/style.min.css': 'static/css/style.min.css'
        }
      },
      dev: {
        options: {
          map: true
        },
        files: {
          'static/css/style.css': 'static/css/style.css'
        }
      }
    },

    concat: {
      dist: {
        files: [
          {
            dest: 'static/js/external.min.js',
            src: [
              'static/bower_components/angular-route/angular-route.min.js',
              'static/bower_components/angular/angular.min.js',
              'static/bower_components/bootstrap/dist/js/bootstrap.min.js',
              'static/bower_components/jquery/dist/jquery.min.js',
              'static/bower_components/react/react.min.js',
              'static/bower_components/react/react-dom.min.js',
              'static/bower_components/moment/min/moment.min.js'
            ]
          }
        ]
      }
    },

    filerev: {
      options: {
        algorithm: 'md5',
        length: 8
      },
      dist: {
        src: ['static/js/*.min.js', 'static/css/*.min.css']
      }
    },

    karma: {
      unit: {
        configFile: './karma.conf.js',
        autoWatch: true,
        singleRun: false
      },
    },

    eshint: {
    	all: ['Gruntfile.js', 'karma.config.js', 'client/**/*.es6']
  	},

    watch: {
      grunt: {
        options: {
          reload: true
        },
        files: 'Gruntfile.js'
      },

      less: {
        files: 'client/src/less/**/*.less',
        tasks: ['css:dev']
      },

      js: {
        files: 'client/src/js/**/*.es6',
        tasks: ['js:dev']
      },

      css: {
        options: {
          livereload: true //port 35729
        },
        files: 'static/**/*.css'
      },

      html: {
        files: ['client/src/**/*.html'],
        tasks: ['inject_all:dev']
      }
    },

    concurrent: {
      dev: {
        tasks: ['nodemon', 'watch:js', 'watch:css'],
        options: {
          logConcurrentOutput: true
        }
      }
    },

    nodemon: {
      dev: {
        script: './index.js'
      }
    },

    clean: {
      all: ['static/*', '!static/bower_components']
    }
  });

  grunt.registerTask('default', ['dev']);
  grunt.registerTask('dev', ['clean', 'css:dev', 'js:dev', 'inject:dev', 'concurrent']);
  grunt.registerTask('dist', ['clean', 'css:dist', 'js:dist', 'concat:dist', 'filerev:dist', 'inject:dist']);
  grunt.registerTask('js:dev', ['browserify:dev']);
  grunt.registerTask('js:dist', ['browserify:dist']);
  grunt.registerTask('inject:dev', ['copy', 'wiredep', 'injector:dev']);
  grunt.registerTask('inject:dist', ['copy', 'injector:dist']);
  grunt.registerTask('css:dev', ['less:dev', 'autoprefixer:dev']);
  grunt.registerTask('css:dist', ['less:dist', 'autoprefixer:dist']);

  // testing
  grunt.registerTask('test', ['lint', 'karma:unit']);
  grunt.registerTask('lint', ['eslint']);
};
