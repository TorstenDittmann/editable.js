'use strict';

// livereload
var path = require('path');
var lrSnippet = require('grunt-contrib-livereload/lib/utils').livereloadSnippet;
var folderMount = function folderMount(connect, point) {
  return connect.static(path.resolve(point));
};

module.exports = function (grunt) {

  // load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);


  grunt.initConfig({
    livereload: {
      port: 35729 // Default livereload listening port.
    },
    watch: {
      livereload: {
        files: [
          '*.html',
          'src/{,*/}*.js',
          'test/js/{,*/}*.js',
          'test/css/{,*/}*.css'
        ],
        tasks: ['livereload']
      }
    },
    connect: {
      livereload: {
        options: {
          port: 9000,
          // Change this to '0.0.0.0' to access the server from outside.
          middleware: function(connect, options) {
            return [lrSnippet, folderMount(connect, options.base)];
          }
        }
      },
      test: {
        options: {
          port: 9001,
          middleware: function (connect, options) {
            return [
              folderMount(connect, options.base)
            ];
          }
        }
      }
    },
    open: {
      server: {
        url: 'http://localhost:<%= connect.livereload.options.port %>'
      }
    },
    clean: {
      dist: ['.tmp', 'dist'],
      server: '.tmp'
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: [
        'Gruntfile.js',
        'src/{,*/}*.js'
      ]
    },
    karma: {
      unit: {
        configFile: 'karma.conf.js',
        browsers: ['PhantomJS']
      },
      browsers: {
        configFile: 'karma.conf.js',
        browsers: ['Chrome', 'Firefox', 'Safari']
      },
      build: {
        configFile: 'karma.conf.js',
        browsers: ['Chrome', 'Firefox', 'Safari'],
        singleRun: true
      }
    },
    concat: {
      dist: {
        files: {
          'dist/editable.js': [
            'vendor/rangy-1.2.3/rangy-core.js',
            'vendor/bowser.js',
            'src/core.js',
            'src/!(core).js'
          ]
        }
      }
    },
    uglify: {
      dist: {
        files: {
          'dist/editable.min.js': [
            'dist/editable.js'
          ],
        }
      }
    }
  });

  // livereload does not work with grunt-contrib-watch, so we use regarde instead
  // https://github.com/gruntjs/grunt-contrib-watch/issues/59
  grunt.renameTask('regarde', 'watch');

  grunt.registerTask('server', [
    'clean:server',
    'livereload-start',
    'connect:livereload',
    'open',
    'watch:livereload'
  ]);

  grunt.registerTask('test', [
    'karma:unit'
  ]);

  grunt.registerTask('lint', [
    'jshint'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    'karma:build',
    'jshint',
    'concat:dist',
    'uglify'
  ]);

  grunt.registerTask('default', ['server']);
};