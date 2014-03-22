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
      "grunt-contrib-watch"
    ];
  var index = 0;
  var length = npmTasks.length;

  grunt.initConfig({
    pkg: pkg,
    meta: {
      src: "src",
      dest: "dest",
      style: "<%= meta.src %>/assets/stylesheets",
      style_var: "<%= meta.style %>/variables",
      style_mixin: "<%= meta.style %>/mixins"
    },
    concat: {
      options: {
        process: function( src, filepath ) {
          return src.replace(/@(NAME|VERSION)/g, function( text, key ) {
            return info[key.toLowerCase()];
          });
        }
      },
      build: {
        src: ["<%= meta.style_var %>/*.scss",
              "<%= meta.style_mixin %>/*.scss",
              "<%= meta.style %>/base.scss",
              "<%= meta.style %>/layout.scss"],
        dest: "<%= meta.dest %>/application.scss"
      }
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
          "<%= meta.dest %>/layout.html": "<%= meta.src %>/views/layouts/layout.jade"
        }
      }
    },
    compass: {
      compile: {
        options: {
          sassDir: "<%= meta.dest %>",
          cssDir: "<%= meta.dest %>"/*,
          outputStyle: "compressed"*/
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

  grunt.registerTask("default", ["concat", "compass", "jade"]);
};
