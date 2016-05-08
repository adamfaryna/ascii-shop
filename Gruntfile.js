module.exports = function(grunt) {

  var appConfig = {
    app: require('./bower.json').appPath || 'app'
  };

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    /**
     * COMPILE
     */
    //add require() to front-end code
    browserify: {
      dist: {
        options: {
          transform: [
                 ['babelify', { //add in ES2015 support
                   presets: ['es2015']
                 }],
                 ['uglifyify'] //minify each file before the concat/minify
          ]
        },
        files: {
          'statics/build/js/app.js' : 'static/app/**/*.es6'
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
          'statics/build/js/app.js' : 'static/app/**/*.es6'
        }
      }
    },
    //compress
    uglify: {
      options: {
        sourceMap: false,
        report: 'min',
        compress: {
          drop_console: true
        }
      },
      main: {
        src: 'static/build/js/app.js',
        dest: 'static/build/js/app.min.js'
      }
    },
    //move built js to public
    // copy: {
    //   dev: {
    //     files: [
    //       {
    //         expand: true,
    //         src: ['app.js'],
    //         cwd: 'assets/build/js/',
    //         dest: 'public/javascripts'
    //       }
    //     ]
    //   },
    //   dist: {
    //     files: [
    //       {
    //         expand: true,
    //         src: ['app.min.js'],
    //         cwd: 'assets/build/js/',
    //         dest: 'public/javascripts'
    //       }
    //     ]
    //   }
    // },

    less: {
      options: {
        paths: ['bower_components/bootstrap/less'],
        sourceMap: true
      },
      dist: {
        options: {
          outputStyle: 'compressed'
        },
        files: {
          'static/css/style.css': 'client/src/less/style.scss'
        }
      },
      dev: {
        files: {
          'static/css/style.css': 'client/src/less/style.scss'
        }
      }
    },

    // add browser specific prefixes
    autoprefixer: {
      options: {
        browsers: ['last 2 versions', 'ie 8', 'ie 9'],
        map: true
      },
      dist:{
        files:{
          'static/css/app.css': 'static/css/app.css'
        }
      },
      dev: {
        options: {
          sourceMap: true
        },
        files: {
          'static/css/app.css': 'static/css/app.css'
        }
      }
    },

    //karma test
    karma: {
      unit: {
        configFile: './karma.conf.js',
        autoWatch: true,
        singleRun: false
      },
    },

    eslint: {
      all: ['Gruntfile.js', 'client/**/*.js']
    },

    /**
     *  DEPLOY
     */
    //create hash of file, add it to names, ensuring uniqueness on cloudflare etc.
    filerev: {
      options: {
        algorithm: 'md5',
        length: 8
      },
      files: {
        src: ['public/css/app.css', 'public/javascripts/app.min.js', 'public/javascripts/app.js', 'bower_components/**/*.js']
      }
    },
    //switch bower references with their minimised version
    useminPrepare: {
      html: [
        'views/index.ejs'
      ]
    },
    usemin: {
      html: ['views/index.ejs', 'views/header.ejs'],
      options: {
        assetsDirs: ['public', 'bower_components']
      }
    },
    shell: {
      cp: {
        command: [
          'aws s3 cp public/MyFontsWebfontsKit.css s3://trussle-assets/',
          'aws s3 cp public/foundation.css s3://trussle-assets/',
          'aws s3 cp public/foundation.min.css s3://trussle-assets/',
          'aws s3 cp public/normalize.css s3://trussle-assets/',
          'aws s3 cp --recursive public/css/ s3://trussle-assets/css/',
          'aws s3 cp --recursive public/favicons/ s3://trussle-assets/favicons/',
          'aws s3 cp --recursive public/img/ s3://trussle-assets/img/',
          'aws s3 cp --recursive bower_components/ s3://trussle-assets/bower_components',
          'aws s3 cp --recursive public/javascripts/ s3://trussle-assets/javascripts/',
          'aws s3 cp --recursive public/webfonts/ s3://trussle-assets/webfonts/',
          'aws s3 cp --recursive public/js/ s3://trussle-assets/js/'
        ].join('&&')
      },
      e2e: './bin/e2e'
    },
    cdn: {
      options: {
        cdn: 'https://d3felmon7p2a4r.cloudfront.net/',
        flatten: true,
        supportedTypes: {'ejs': 'html'}
      },
      dist: {
        cwd: './views/',
        dest: './views',
        src: ['index.ejs', 'error.ejs', 'incompatible.ejs', '../public/partials/**/*.html', '../public/css/app.css']
      }
    },

  /**
   * Watch
   */
    watch: {
      grunt: {
        options: {
          reload: true
        },
        files: ['Gruntfile.js']
      },

      sass: {
        files: 'assets/src/scss/**/*.scss',
        tasks: ['dev']
      },

      build: {
        files: 'assets/src/js/**/*.js',
        tasks: ['dev']
      },

      js: {
        files: 'assets/src/js/**/*.js',
        tasks: ['js']
      },

      css: {
        files: 'assets/src/scss/**/*.scss',
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
        script: './bin/www'
      }
    }

  });

  grunt.loadNpmTasks("grunt-browserify");
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-protractor-runner');
  grunt.loadNpmTasks('grunt-cdn');
  grunt.loadNpmTasks('grunt-filerev');
  grunt.loadNpmTasks('grunt-usemin');
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-concurrent');

  // grunt tasks
  grunt.registerTask('default', ['dev']);
  grunt.registerTask('ci', ['sass:dist', 'autoprefixer:dist', 'browserify:dist', 'uglify', 'copy:dist']);
  grunt.registerTask('dev', ['sass:dev', 'autoprefixer:dev', 'browserify:dev', 'copy:dev']);
  grunt.registerTask('js', ['browserify:dev', 'copy:dev']);
  grunt.registerTask('jswatch', ['watch:js']);
  grunt.registerTask('css', ['sass:dev', 'autoprefixer:dev']);
  grunt.registerTask('csswatch', ['watch:css']);
  grunt.registerTask('devel', ['dev', 'concurrent:dev']);

  // testing
  grunt.registerTask('unit', ['lint', 'mochaTest:lids', 'karma:unit']);
  grunt.registerTask('test', ['unit', 'e2e']);
  grunt.registerTask('e2e', ['shell:e2e']);
  grunt.registerTask('lint', ['eslint']);
  // deploy
  grunt.registerTask('deploy', ['useminPrepare', 'filerev', 'usemin', 'cdn', 'shell:cp']);

};