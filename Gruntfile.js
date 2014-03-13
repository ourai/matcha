module.exports = function( grunt ) {
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    dirs: {
      src: "src",
      dest: "dest/<%= pkg.version %>"
    },
    cssmin: {
      minify: {
        files: {
          "./lib/normalize.min.css": ["./vendor/normalize.css/normalize.css"]
        }
      }
    }
  });

  grunt.loadNpmTasks("grunt-contrib-cssmin");

  grunt.registerTask("minify", "Minifies StyleSheet files.", ["cssmin"]);

  grunt.registerTask("default", ["minify"]);
};
