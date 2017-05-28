/**
 * @file
 * Grunt configurations.
 */

module.exports = function (grunt) {
  grunt.initConfig({
    env: grunt.option('env') || process.env.NODE_ENV || 'development',
    pkg: grunt.file.readJSON('package.json')
  });

  // Load production tasks by default
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-postcss');
  grunt.loadNpmTasks('grunt-sass');

  grunt.config('clean', [
    'test/css',
    'test/js'
  ]);

  grunt.config('uglify', {
    options: {
      mangle: false,
      wrap: false,
      screwIE8: true
    },
    dist: {
      files: {
        'test/js/bundle.js': [
          'js/**/*.js',
          'node_modules/approvejs/dist/approve.min.js'
        ]
      }
    },
    dev: {
      options: {
        sourceMap: true,
        beautify: true
      },
      files: {
        'test/js/bundle.js': [
          'js/**/*.js',
          'node_modules/approvejs/dist/approve.min.js'
        ]
      }
    }
  });

  grunt.config('postcss', {
    options: {
      syntax: require('postcss-scss'),
      processors: [
        require('autoprefixer')({ browsers: ['last 3 version', 'ff >= 36', 'ie >= 11'] }),
        require('postcss-discard-duplicates')(),
      ],
      map: {
        inline: false
      }
    },
    dist: {
      options: {
        map: false,
        processors: [
          require('cssnano')()
        ]
      },
      src: 'test/css/**/*.css'
    },
    dev: {
      src: 'test/css/**/*.css'
    }
  });

  grunt.config('sass', {
    options: {
      outputStyle: 'expanded',
      sourceMap: true,
      indentedSyntax: true,
      sassDir: 'scss',
      cssDir: 'test/css',
      includePaths: [
        'node_modules/normalize-scss/sass',
        'node_modules/modularscale-sass/stylesheets',
        'node_modules/typi/scss',
      ]
    },
    dev: {
      files: [{
        expand: true,
        cwd: 'scss/',
        src: ['**/*.scss'],
        dest: 'test/css/',
        ext: '.css'
      }]
    },
    dist: {
      options: {
        sourceMap: false
      },
      files: [{
        expand: true,
        cwd: 'scss/',
        src: ['**/*.scss'],
        dest: 'test/css/',
        ext: '.css'
      }]
    }
  });

  if (grunt.config('env') !== 'production') {
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-eslint');
    grunt.loadNpmTasks('grunt-browser-sync');
    grunt.loadNpmTasks('grunt-concurrent');

    grunt.config('watch', {
      source: {
        files: ['scss/**/*.scss', 'js/**/*.js'],
        tasks: ['build']
      }
    });

    grunt.config('eslint', {
      options: {
        ignorePattern: ['js/lib/**/*.js'],
        configFile: 'config/eslint.json'
      },
      target: ['js/**/*.js']
    });

    grunt.config('browserSync', {
      bsFiles: {
        src : [
          './test/css/*.css',
          './test/js/*.js',
          './test/*.html'
        ]
      },
      options: {
        server: {
          baseDir: "./test"
        }
      }
    });

    grunt.config('concurrent', {
      options: {
        logConcurrentOutput: true
      },
      tasks: ['browserSync', 'watch']
    });

    grunt.registerTask('build', ['clean', 'sass:dev', 'postcss:dev', 'eslint', 'uglify:dev']);
  }

  grunt.registerTask('dist', ['clean', 'sass:dist', 'postcss:dist', 'uglify:dist']);
  grunt.registerTask('default', ['concurrent']);
};
