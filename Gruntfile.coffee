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

  preprocess = ( src, filepath ) ->
    return src.replace /^/gm, "\x20\x20"

  grunt.initConfig
    repo: info
    pkg: pkg
    meta:
      temp: ".<%= pkg.name %>-cache"

      image: "src/images"
      style: "src/stylesheets"
      script: "src/javascripts"
      classes: "src/javascripts/classes"
      components: "src/javascripts/components"

      dest_image: "images"
      dest_style: "stylesheets"
      dest_script: "javascripts"
    concat:
      coffee:
        options:
          process: ( src, filepath ) ->
            return src.replace /@(NAME|VERSION)/g, ( text, key ) ->
              return info[key.toLowerCase()]
        files:
          "<%= meta.classes %>/CustomComponent.coffee": "vendors/CustomComponent/CustomComponent.coffee"
          "<%= meta.temp %>/classes.coffee": "<%= meta.classes %>/CustomComponent.coffee"
          "<%= meta.temp %>/components.coffee": [
              "<%= meta.components %>/drop-down_list.coffee"
              "<%= meta.components %>/score.coffee"
              "<%= meta.components %>/tabs.coffee"
              "<%= meta.components %>/uploader.coffee"
              "<%= meta.components %>/data_list.coffee"
              "<%= meta.components %>/slides.coffee"
            ]
          "<%= meta.temp %>/<%= pkg.name %>.coffee": [
              "build/intro.coffee"
              "<%= meta.script %>/variables.coffee"
              "<%= meta.script %>/functions.coffee"
              "<%= meta.temp %>/classes.coffee"
              "<%= meta.script %>/methods.coffee"
              "<%= meta.temp %>/components.coffee"
              "build/outro.coffee"
            ]
      js_pre:
        options:
          process: preprocess
        files:
          "<%= meta.temp %>/__miso.js": "<%= meta.temp %>/miso.js"
          "<%= meta.temp %>/__<%= pkg.name %>.js": "<%= meta.temp %>/<%= pkg.name %>.js"
      js_normal:
        src: [
            "build/intro.js"
            "<%= meta.temp %>/__miso.js"
            "<%= meta.temp %>/__<%= pkg.name %>.js"
            "build/outro.js"
          ]
        dest: "<%= meta.dest_script %>/<%= pkg.name %>.js"
      matcha:
        files:
          "<%= meta.style %>/_vendors.scss": [
              "vendors/painter/_painter.scss"
              "vendors/tangram/_tangram.scss"
            ]
          "<%= meta.dest_style %>/_helper.scss": [
              "<%= meta.style %>/_vendors.scss"
              # Core variables, functions
              "<%= meta.style %>/_variables.scss"
              "<%= meta.style %>/_functions.scss"
              # Mixins
              "<%= meta.style %>/mixins/_typography.scss"
              "<%= meta.style %>/mixins/_utilities.scss"
              "<%= meta.style %>/mixins/_components.scss"
            ]
          "<%= meta.dest_style %>/_rules.scss": [
              # Bridge
              "build/_bridge.scss"
              # Reset
              "<%= meta.style %>/_reset.scss"
              "<%= meta.style %>/_g11n.scss"
              "<%= meta.style %>/_utilities.scss"
              # Typography
              "<%= meta.style %>/_punctuation.scss"
              # Components
              "<%= meta.style %>/_button.scss"
              "<%= meta.style %>/_dropdown.scss"
              "<%= meta.style %>/_list.scss"
              "<%= meta.style %>/_item.scss"
              "<%= meta.style %>/_score.scss"
              "<%= meta.style %>/_tabs.scss"
              "<%= meta.style %>/_uploader.scss"
              "<%= meta.style %>/_slides.scss"
              "<%= meta.style %>/_menu.scss"
            ]
      matcha_helper:
        files:
          "test/stylesheets/_vendors.scss": "src/stylesheets/_vendors.scss"
          "test/stylesheets/_variables.scss": "src/stylesheets/_variables.scss"
          "test/stylesheets/_functions.scss": "src/stylesheets/_functions.scss"
          "test/stylesheets/_mixins.scss": [
              "src/stylesheets/mixins/_typography.scss"
              "src/stylesheets/mixins/_utilities.scss"
              "src/stylesheets/mixins/_components.scss"
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
          cssDir: "test/stylesheets"
          javascriptsDir: "test/javascripts"
          imagesDir: "test/images"
      test:
        options:
          sassDir: "test"
          cssDir: "test"
    coffee:
      build_normal:
        options:
          bare: false
          separator: "\x20"
        files:
          "<%= meta.temp %>/miso.js": "vendors/miso/miso.coffee"
          "<%= meta.temp %>/<%= pkg.name %>.js": "<%= meta.temp %>/<%= pkg.name %>.coffee"
      test:
        options:
          bare: true
          separator: "\x20"
        src: "test/test.coffee"
        dest: "test/test.js"
    uglify:
      options:
        banner: "/*!\n" +
                " * <%= repo.name %> UI Library v<%= repo.version %>\n" +
                " * <%= pkg.homepage %>\n" +
                " *\n" +
                " * Copyright Ourai Lin, http://ourai.ws/\n" +
                " *\n" +
                " * Date: <%= grunt.template.today('yyyy-mm-dd') %>\n" +
                " */\n"
        sourceMap: false
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
        cwd: "."
        src: ["images/*", "javascripts/*"]
        dest: "test"
    cssmin:
      minify:
        options:
          banner: "/*!\n" +
                  " * <%= repo.name %> UI Library v<%= repo.version %>\n" +
                  " * <%= pkg.homepage %>\n" +
                  " *\n" +
                  " * Copyright Ourai Lin, http://ourai.ws/\n" +
                  " *\n" +
                  " * Date: <%= grunt.template.today('yyyy-mm-dd') %>\n" +
                  " */\n"
          keepSpecialComments: 0
        files:
          "<%= meta.dest_style %>/<%= pkg.name %>.min.css": "<%= meta.dest_style %>/<%= pkg.name %>.css"

  grunt.loadNpmTasks task for task in npmTasks

  # Tasks about Sass
  grunt.registerTask "compile_sass", [
      "concat:matcha"
      "compass:compile"
      "cssmin"
    ]
  # Tasks about CoffeeScript
  grunt.registerTask "compile_coffee", [
      "concat:coffee"
      "coffee:build_normal"
      "concat:js_pre"
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
