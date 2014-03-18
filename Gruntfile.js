module.exports = function( grunt ) {
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    meta: {
      src: "src",
      dest: "dest"
    },
    jade: {
      compile: {
        options: {
          pretty: true,
          data: {
            debug: false
          }
        },
        files: {
          "<%= meta.src %>/layout.html": "<%= meta.src %>/layouts/layout.jade"
        }
      }
    },
    compass: {
      compile: {
        options: {
          sassDir: "src/stylesheets",
          cssDir: "src/stylesheets",
          outputStyle: "compressed"
        }
      }
    },
    watch: {
      css: {
        files: ["src/stylesheets/**/*.scss"],
        tasks: ["compass"]
      },
      html: {
        files: ["src/layouts/**/*.jade"],
        tasks: ["jade"]
      }
    }
  });

  grunt.loadNpmTasks("grunt-contrib-jade");
  grunt.loadNpmTasks("grunt-contrib-compass");
  grunt.loadNpmTasks("grunt-contrib-watch");

  grunt.registerTask("default", ["watch"]);
};
