module.exports = function( grunt ) {
  var pkg = grunt.file.readJSON("package.json");
  var info = {
      name: pkg.name.charAt(0).toUpperCase() + pkg.name.substring(1),
      version: pkg.version
    };
  var npmTasks = [
      "grunt-contrib-concat",
      "grunt-contrib-jade",
      "grunt-contrib-sass"
    ];
  var index = 0;
  var length = npmTasks.length;

  grunt.initConfig({
    pkg: pkg,
    meta: {
      src: "src",
      sass: "src/scss",
      build: "build",
      tests: "<%= meta.build %>/tests",
      tasks: "<%= meta.build %>/tasks",
      layouts: "<%= meta.tests %>/layouts",
      cmpts: "<%= meta.tests %>/components"
    },
    concat: {
      vendors: {
        src: ["vendors/normalize.css/normalize.css"],
        dest: "<%= meta.sass %>/_vendors.scss"
      }
    },
    sass: {
      compile: {
        files: [{
          expand: true,
          cwd: "<%= meta.src %>",
          src: ["*.scss"],
          dest: "<%= meta.src %>",
          ext: ".css"
        }]
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
    }
    compass: {
      compile: {
        options: {
          sassDir: "<%= meta.src %>",
          cssDir: "<%= meta.src %>"
        }
      }
    },
    cssmin: {
      minify: {
        files: {
          "<%= meta.dest %>/<%= pkg.name %>.min.css": "<%= meta.dest %>/<%= pkg.name %>.css"
        }
      }
    },*/
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

  grunt.registerTask("default", ["sass"]);
};
