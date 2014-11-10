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
      "grunt-contrib-jade"
      "grunt-contrib-concat"
      "grunt-contrib-copy"
      "grunt-contrib-clean"
    ]

  grunt.initConfig
    repo: info
    pkg: pkg
    meta:
      base: "src/base"
      base_c: "<%= meta.base %>/coffee"
      base_s: "<%= meta.base %>/sass"

      helpers: "src/helpers"
      helpers_s: "<%= meta.helpers %>/sass"

      modules: "src/modules"
      mod_cmpt: "<%= meta.modules %>/Component"
      mod_cmpt_c: "<%= meta.mod_cmpt %>/coffee"
      mod_cmpt_s: "<%= meta.mod_cmpt %>/sass"
      mod_layout: "<%= meta.modules %>/Layout"
      mod_layout_s: "<%= meta.layout %>/sass"
      mod_typo: "<%= meta.modules %>/Typography"
      mod_typo_s: "<%= meta.mod_typo %>/sass"

      temp: ".<%= pkg.name %>-cache"
      image: "src/images"

      dest: "dest"
      dest_style: "<%= meta.dest %>/stylesheets"
      dest_script: "<%= meta.dest %>/javascripts"
      dest_image: "<%= meta.dest %>/images"

      tests: "test"
    concat:
      sass:
        files:
          "<%= meta.dest_style %>/_vendors.scss": [
              "vendors/normalize.css/normalize.css"
            ]
          "<%= meta.dest_style %>/sass/_helpers.scss": [
              "<%= meta.helpers_s %>/_variables.scss"
              "<%= meta.helpers_s %>/_functions.scss"
              "<%= meta.helpers_s %>/_enhancement.scss"
              "<%= meta.helpers_s %>/_mixins.scss"
            ]
          "<%= meta.dest_style %>/_rules.scss": [
              "<%= meta.base_s %>/_reset.scss"
              "<%= meta.base_s %>/_g11n.scss"
              "<%= meta.base_s %>/_utilities.scss"
              "<%= meta.mod_cmpt_s %>/*.scss"
            ]
          "<%= meta.dest_style %>/_typography.scss": [
              "<%= meta.mod_typo_s %>/_helper.scss"
              "<%= meta.mod_typo_s %>/_punctuation.scss"
            ]
          "<%= meta.dest_style %>/<%= pkg.name %>.scss": [
              "build/rules.scss"
            ]
      coffee:
        files:
          "<%= meta.temp %>/components.coffee": [
              "<%= meta.mod_cmpt_c %>/initializer.coffee"
              "<%= meta.mod_cmpt_c %>/drop-down_list.coffee"
              "<%= meta.mod_cmpt_c %>/score.coffee"
              "<%= meta.mod_cmpt_c %>/tabs.coffee"
              "<%= meta.mod_cmpt_c %>/uploader.coffee"
              "<%= meta.mod_cmpt_c %>/data_list.coffee"
            ]
          "<%= meta.temp %>/<%= pkg.name %>.coffee": [
              "<%= meta.base_c %>/intro.coffee"
              "<%= meta.base_c %>/variables.coffee"
              "<%= meta.base_c %>/functions.coffee"
              "<%= meta.temp %>/components.coffee"
              "<%= meta.base_c %>/outro.coffee"
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
    compass:
      compile:
        options:
          sassDir: "<%= meta.dest_style %>"
          cssDir: "<%= meta.dest_style %>"
          javascriptsDir: "<%= meta.dest_script %>"
          imagesDir: "<%= meta.dest_image %>"
      test:
        options:
          sassDir: "<%= meta.dest_style %>"
          cssDir: "<%= meta.tests %>/stylesheets"
          javascriptsDir: "<%= meta.tests %>/javascripts"
          imagesDir: "<%= meta.tests %>/images"
      test_2:
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
      sass:
        expand: true
        cwd: "<%= meta.mod_layout %>"
        src: ["sass/*"]
        dest: "<%= meta.dest_style %>"
        filter: "isFile"
      image:
        expand: true
        cwd: "<%= meta.image %>"
        src: ["**"]
        dest: "<%= meta.dest_image %>"
      test:
        expand: true
        cwd: "<%= meta.dest %>"
        src: ["images/*", "javascripts/*", "stylesheets/sass/*"]
        dest: "<%= meta.tests %>"
    clean:
      compiled:
        src: [
            "<%= meta.temp %>/**"
            "<%= meta.dest_style %>/*.scss"
          ]
    ###
    jade:
      compile:
        options:
          pretty: true
          data:
            debug: false
        files:
          "<%= meta.dest %>/layout.html": "<%= meta.src %>/views/layouts/layout.jade"
    ###
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
      "concat:sass"
      "copy:sass"
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
      "compass:test"
      "compass:test_2"
    ]
  # Default task
  grunt.registerTask "default", [
      "compile_sass"
      "compile_coffee"
      "copy:image"
      "test"
      "clean"
    ]

  grunt.registerTask "cct", [
      "compile_coffee"
      "clean"
    ]
