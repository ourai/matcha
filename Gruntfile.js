module.exports = function( grunt ) {
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    dirs: {
      src: "src",
      dest: "dest/<%= pkg.version %>"
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
          "dest/layout.html": "<%= dirs.src %>/layouts/layout.jade"
        }
      }
    }
  });

  // grunt.loadNpmTasks("grunt-contrib-cssmin");
  grunt.loadNpmTasks("grunt-contrib-jade");

  grunt.registerTask("default", ["jade"]);
};
