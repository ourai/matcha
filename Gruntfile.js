module.exports = function( grunt ) {
  var pkg = grunt.file.readJSON("package.json");
  var info = {
      name: pkg.name.charAt(0).toUpperCase() + pkg.name.substring(1),
      version: pkg.version
    };
  var npmTasks = [
      "grunt-contrib-concat",
      "grunt-contrib-jade",
      "grunt-contrib-compass",
      "grunt-contrib-copy",
      "grunt-contrib-cssmin",
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
      }
    },
    compass: {
      compile: {
        options: {
          sassDir: "<%= meta.dest %>",
          cssDir: "<%= meta.dest %>"
        }
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
        src: ["dest/*.scss", "!dest/_helpers.scss"]
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

  grunt.registerTask("default", ["concat", "copy", "compass", "cssmin", "clean"]);
};
