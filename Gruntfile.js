module.exports = function( grunt ) {
  var pkg = grunt.file.readJSON("package.json");
  var info = {
      name: pkg.name.charAt(0).toUpperCase() + pkg.name.substring(1),
      version: pkg.version
    };
  var npmTasks = [
      "grunt-contrib-compass",
      "grunt-contrib-cssmin",
      "grunt-contrib-coffee",
      "grunt-contrib-uglify",
      "grunt-contrib-jade",
      "grunt-contrib-concat",
      "grunt-contrib-copy",
      "grunt-contrib-clean"
    ];
  var index = 0;
  var length = npmTasks.length;

  grunt.initConfig({
    pkg: pkg,
    meta: {
      src: "src",
      sass: "src/scss",
      helpers: "<%= meta.sass %>/helpers",
      base: "<%= meta.sass %>/base",
      coffee: "src/coffee",
      js: "src/js",
      dest: "dest",
      build: "build",
      tests: "<%= meta.build %>/tests",
      tasks: "<%= meta.build %>/tasks",
      layouts: "<%= meta.tests %>/layouts",
      cmpts: "<%= meta.tests %>/components"
    },
    concat: {
      helpers: {
        src: ["<%= meta.helpers %>/_variables.scss",
              "<%= meta.helpers %>/_functions.scss",
              "<%= meta.helpers %>/_mixins.scss"],
        dest: "<%= meta.dest %>/_helpers.scss"
      },
      vendors: {
        src: ["vendors/normalize.css/normalize.css"],
        dest: "<%= meta.dest %>/_vendors.scss"
      },
      rules: {
        src: ["<%= meta.base %>/_reset.scss",
              "<%= meta.base %>/_components.scss",
              "<%= meta.base %>/_g11n.scss"],
        dest: "<%= meta.dest %>/_rules.scss"
      },
      core: {
        src: ["<%= meta.sass %>/rules.scss"],
        dest: "<%= meta.dest %>/<%= pkg.name %>.scss"
      },
      coffee: {
        src: ["<%= meta.coffee %>/intro.coffee",
              "<%= meta.coffee %>/variables.coffee",
              "<%= meta.coffee %>/functions.coffee",
              "<%= meta.coffee %>/components.coffee",
              "<%= meta.coffee %>/outro.coffee"],
        dest: "<%= meta.dest %>/<%= pkg.name %>.coffee"
      },
      js: {
        options: {
          process: function( src, filepath ) {
            return src.replace(/@(NAME|VERSION)/g, function( text, key ) {
              return info[key.toLowerCase()];
            });
          }
        },
        src: ["<%= meta.js %>/intro.js",
              "<%= meta.js %>/<%= pkg.name %>.js",
              "<%= meta.js %>/outro.js"],
        dest: "<%= meta.dest %>/<%= pkg.name %>.js"
      }
    },
    compass: {
      compile: {
        options: {
          sassDir: "<%= meta.dest %>",
          cssDir: "<%= meta.dest %>",
          javascriptsDir: "<%= meta.dest %>",
          imagesDir: "<%= meta.dest %>"
        }
      }
    },
    coffee: {
      options: {
        bare: true,
        separator: "\x20"
      },
      build: {
        src: "<%= meta.dest %>/<%= pkg.name %>.coffee",
        dest: "<%= meta.js %>/<%= pkg.name %>.js"
      }
    },
    uglify: {
      options: {
        banner: "/*! <%= pkg.name %> <%= grunt.template.today('yyyy-mm-dd') %> */\n"
      },
      build: {
        src: "<%= meta.dest %>/<%= pkg.name %>.js",
        dest: "<%= meta.dest %>/<%= pkg.name %>.min.js"
      }
    },
    copy: {
      sass: {
        expand: true,
        cwd: "<%= meta.sass %>",
        src: ["layouts/*"],
        dest: "dest",
        filter: "isFile"
      }
    },
    clean: {
      compiled: {
        src: ["dest/*.coffee",
              "dest/*.scss",
              "!dest/_helpers.scss"]
      }
    },
    /*jade: {
      compile: {
        options: {
          pretty: true,
          data: {
            debug: false
          }
        },
        files: {
          "<%= meta.dest %>/layout.html": "<%= meta.src %>/views/layouts/layout.jade"
        }
      }
    }*/
    cssmin: {
      minify: {
        files: {
          "<%= meta.dest %>/<%= pkg.name %>.min.css": "<%= meta.dest %>/<%= pkg.name %>.css"
        }
      }
    },
    watch: {
      css: {
        files: ["<%= meta.dest %>/**/*.scss"],
        tasks: ["compass"]
      },
      html: {
        files: ["src/layouts/**/*.jade"],
        tasks: ["jade"]
      }
    }
  });

  for (; index < length; index++) {
    grunt.loadNpmTasks(npmTasks[index]);
  }

  // Tasks about Sass
  grunt.registerTask("compile_sass", [
    "concat:helpers",
    "concat:vendors",
    "concat:rules",
    "concat:core",
    "copy:sass",
    "compass",
    "cssmin"]);
  // Tasks about CoffeeScript
  grunt.registerTask("compile_coffee", [
    "concat:coffee",
    "coffee",
    "concat:js",
    "uglify"]);
  // Default task
  grunt.registerTask("default", ["compile_sass", "compile_coffee", "clean"]);
};
