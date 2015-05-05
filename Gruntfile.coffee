module.exports = ( grunt ) ->
  pkg = grunt.file.readJSON "package.json"
  info =
    name: pkg.name.charAt(0).toUpperCase() + pkg.name.substring(1)
    version: pkg.version
  npmTasks = [
      "grunt-contrib-compass"
      "grunt-contrib-cssmin"
      "grunt-contrib-coffee"
      "grunt-contrib-uglify"
      "grunt-contrib-concat"
      "grunt-contrib-copy"
    ]

  grunt.initConfig
    repo: info
    pkg: pkg
    meta:
      base: "src/javascripts/base"

      modules: "src/javascripts/modules"
      mod_cmpt: "<%= meta.modules %>/Component"

      temp: ".<%= pkg.name %>-cache"
      image: "src/images"

      dest: "dest"
      dest_style: "<%= meta.dest %>/stylesheets"
      dest_script: "<%= meta.dest %>/javascripts"
      dest_image: "<%= meta.dest %>/images"

      tests: "test"
    concat:
      coffee:
        files:
          "<%= meta.temp %>/components.coffee": [
              "<%= meta.mod_cmpt %>/initializer.coffee"
              "<%= meta.mod_cmpt %>/drop-down_list.coffee"
              "<%= meta.mod_cmpt %>/score.coffee"
              "<%= meta.mod_cmpt %>/tabs.coffee"
              "<%= meta.mod_cmpt %>/uploader.coffee"
              "<%= meta.mod_cmpt %>/data_list.coffee"
              "<%= meta.mod_cmpt %>/slide.coffee"
            ]
          "<%= meta.temp %>/<%= pkg.name %>.coffee": [
              "<%= meta.base %>/intro.coffee"
              "<%= meta.base %>/variables.coffee"
              "<%= meta.base %>/functions.coffee"
              "<%= meta.temp %>/components.coffee"
              "<%= meta.base %>/outro.coffee"
            ]
      js_normal:
        options:
          process: ( src, filepath ) ->
            return src.replace /@(NAME|VERSION)/g, ( text, key ) ->
              return info[key.toLowerCase()]
        src: [
            "build/intro.js"
            "<%= meta.temp %>/<%= pkg.name %>.js"
            "build/outro.js"
          ]
        dest: "<%= meta.dest_script %>/<%= pkg.name %>.js"
      matcha_helper:
        files:
          "test/stylesheets/_variables.scss": [
              "src/stylesheets/_variables.scss"
            ]
          "test/stylesheets/_functions.scss": [
              "src/stylesheets/_functions.scss"
            ]
          "test/stylesheets/_mixins.scss": [
              "src/stylesheets/mixins/_enhancement.scss"
              "src/stylesheets/mixins/_typography.scss"
              "src/stylesheets/mixins/_utilities.scss"
              "src/stylesheets/mixins/_components.scss"
              "src/stylesheets/mixins/_sandwich.scss"
              "src/stylesheets/mixins/_frameset.scss"
              "src/stylesheets/mixins/_internal.scss"
            ]
    compass:
      compile:
        options:
          sassDir: "build"
          cssDir: "<%= meta.dest_style %>"
          javascriptsDir: "<%= meta.dest_script %>"
          imagesDir: "<%= meta.dest_image %>"
      matcha_for_test:
        options:
          sassDir: "build"
          cssDir: "<%= meta.tests %>/stylesheets"
          javascriptsDir: "<%= meta.tests %>/javascripts"
          imagesDir: "<%= meta.tests %>/images"
      test:
        options:
          sassDir: "<%= meta.tests %>"
          cssDir: "<%= meta.tests %>"
    coffee:
      options:
        bare: true
        separator: "\x20"
      build_normal:
        src: "<%= meta.temp %>/<%= pkg.name %>.coffee"
        dest: "<%= meta.temp %>/<%= pkg.name %>.js"
      test:
        src: "<%= meta.tests %>/test.coffee"
        dest: "<%= meta.tests %>/test.js"
    uglify:
      options:
        banner: "/*!\n" +
                " * <%= repo.name %> UI Library v<%= repo.version %>\n" +
                " * <%= pkg.homepage %>\n" +
                " *\n" +
                " * Copyright 2013, <%= grunt.template.today('yyyy') %> Ourairyu, http://ourai.ws/\n" +
                " *\n" +
                " * Date: <%= grunt.template.today('yyyy-mm-dd') %>\n" +
                " */\n"
        sourceMap: true
      build_normal:
        src: "<%= meta.dest_script %>/<%= pkg.name %>.js"
        dest: "<%= meta.dest_script %>/<%= pkg.name %>.min.js"
    copy:
      image:
        expand: true
        cwd: "<%= meta.image %>"
        src: ["**"]
        dest: "<%= meta.dest_image %>"
      test:
        expand: true
        cwd: "<%= meta.dest %>"
        src: ["images/*", "javascripts/*"]
        dest: "<%= meta.tests %>"
    cssmin:
      minify:
        options:
          banner: "/*!\n" +
                  " * <%= repo.name %> UI Library v<%= repo.version %>\n" +
                  " * <%= pkg.homepage %>\n" +
                  " *\n" +
                  " * Includes Normalize.css\n" +
                  " * http://necolas.github.io/normalize.css/\n" +
                  " *\n" +
                  " * Copyright 2013, <%= grunt.template.today('yyyy') %> Ourairyu, http://ourai.ws/\n" +
                  " *\n" +
                  " * Date: <%= grunt.template.today('yyyy-mm-dd') %>\n" +
                  " */\n"
          keepSpecialComments: 0
        files:
          "<%= meta.dest_style %>/<%= pkg.name %>.min.css": "<%= meta.dest_style %>/<%= pkg.name %>.css"

  grunt.loadNpmTasks task for task in npmTasks

  # Tasks about Sass
  grunt.registerTask "compile_sass", [
      "compass:compile"
      "cssmin"
    ]
  # Tasks about CoffeeScript
  grunt.registerTask "compile_coffee", [
      "concat:coffee"
      "coffee:build_normal"
      "concat:js_normal"
      "uglify"
    ]
  grunt.registerTask "test", [
      "coffee:test"
      "copy:test"
      "compass:matcha_for_test"
      "concat:matcha_helper"
      "compass:test"
    ]
  # Default task
  grunt.registerTask "default", [
      "compile_sass"
      "compile_coffee"
      "copy:image"
      "test"
    ]
