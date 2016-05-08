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
	         ['uglifyify']
          ]
        },
        files: {
          'static/app.js' : 'client/src/**/*.es6'
        }
      },
      dev: {
        options: {
          transform: [
                ['babelify', {
                  presets: ['es2015']
                }]
          ],
          browserifyOptions: {
            debug: true
          }
        },
        files: {
          'static/app.js' : 'client/src/**/*.es6'
        }
      }
    },

    copy: {
      all: {
        files: [{
          expand: true,
          cwd: 'client',
          src: ['partials', 'index.html'],
          desc: 'static'
        }]
      }
    },

    wiredep: {
      task: {
        src: [ 'static/index.html'],
      }
    },

    less: {
      options: {
        paths: ['static/bower_components/bootstrap/less'],
        sourceMap: true
      },
      dist: {
        options: {
          outputStyle: 'compressed'
        },
        files: {
          'static/style.css': 'client/src/less/style.less'
        }
      },
      dev: {
        files: {
          'static/style.css': 'client/src/less/style.less'
        }
      }
    },

    autoprefixer: {
      options: {
        browsers: ['last 2 versions', 'ie 8', 'ie 9'],
        map: true
      },
      dist:{
        files:{
          'static/style.css': 'static/style.css'
        }
      },
      dev: {
        options: {
          sourceMap: true
        },
        files: {
          'static/style.css': 'static/style.css'
        }
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
        files: ['Gruntfile.js']
      },

      less: {
        files: 'client/src/less/**/*.less',
        tasks: ['dev']
      },

      js: {
        files: 'client/src/js/**/*.es6',
        tasks: ['js']
      },

      css: {
        files: 'static/**/*.css',
        tasks: ['css'],
        options: {
          livereload: true //port 35729
        }
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
    }
  });

  grunt.registerTask('default', ['dev']);
  grunt.registerTask('dev', ['css', 'js', 'copy', 'concurrent:dev']);
  grunt.registerTask('js', ['browserify:dev', 'wiredep']);
  grunt.registerTask('css', ['less:dev', 'autoprefixer:dev']);

  // testing
  grunt.registerTask('test', ['lint', 'karma:unit']);
  grunt.registerTask('lint', ['eslint']);
};
