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
      src: "src"
      dest: "dest"
      style: "<%= meta.src %>/stylesheets"
      helpers: "<%= meta.style %>/helpers"
      base: "<%= meta.style %>/base"
      script: "<%= meta.src %>/javascripts"
      coffee: "<%= meta.script %>/coffee"
      image: "<%= meta.src %>/images"
      dest_style: "<%= meta.dest %>/stylesheets"
      dest_script: "<%= meta.dest %>/javascripts"
      dest_image: "<%= meta.dest %>/images"
      build: "build"
      tests: "<%= meta.build %>/tests"
    concat:
      helpers:
        src: [
            "<%= meta.helpers %>/_variables.scss"
            "<%= meta.helpers %>/_functions.scss"
            "<%= meta.helpers %>/_mixins.scss"
          ]
        dest: "<%= meta.dest_style %>/_helpers.scss"
      vendors:
        src: ["vendors/normalize.css/normalize.css"]
        dest: "<%= meta.dest_style %>/_vendors.scss"
      rules:
        src: [
            "<%= meta.base %>/_reset.scss"
            "<%= meta.base %>/_components.scss"
            "<%= meta.base %>/_g11n.scss"
          ]
        dest: "<%= meta.dest_style %>/_rules.scss"
      core:
        src: ["<%= meta.style %>/rules.scss"]
        dest: "<%= meta.dest_style %>/<%= pkg.name %>.scss"
      coffee:
        src: [
            "<%= meta.coffee %>/intro.coffee"
            "<%= meta.coffee %>/variables.coffee"
            "<%= meta.coffee %>/functions.coffee"
            "<%= meta.coffee %>/events.coffee"
            "<%= meta.coffee %>/initialize.coffee"
            "<%= meta.coffee %>/outro.coffee"
          ]
        dest: "<%= meta.dest_script %>/<%= pkg.name %>.coffee"
      js:
        options:
          process: ( src, filepath ) ->
            return src.replace /@(NAME|VERSION)/g, ( text, key ) ->
              return info[key.toLowerCase()]
        src: [
            "<%= meta.script %>/intro.js"
            "<%= meta.script %>/<%= pkg.name %>.js"
            "<%= meta.script %>/outro.js"
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
    coffee:
      options:
        bare: true
        separator: "\x20"
      build:
        src: "<%= meta.dest_script %>/<%= pkg.name %>.coffee"
        dest: "<%= meta.script %>/<%= pkg.name %>.js"
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
      build:
        src: "<%= meta.dest_script %>/<%= pkg.name %>.js"
        dest: "<%= meta.dest_script %>/<%= pkg.name %>.min.js"
    copy:
      sass:
        expand: true
        cwd: "<%= meta.style %>"
        src: ["layouts/*"]
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
        src: ["images/*", "javascripts/*"]
        dest: "<%= meta.tests %>"
    clean:
      compiled:
        src: [
            "<%= meta.dest_script %>/*.coffee"
            "<%= meta.dest_style %>/*.scss"
            "!<%= meta.dest_style %>/_helpers.scss"
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
      "concat:helpers"
      "concat:vendors"
      "concat:rules"
      "concat:core"
      "copy:sass"
      "compass:compile"
      "cssmin"
    ]
  # Tasks about CoffeeScript
  grunt.registerTask "compile_coffee", [
      "concat:coffee"
      "coffee:build"
      "concat:js"
      "uglify"
    ]
  grunt.registerTask "test", [
    "coffee:test"
    "compass:test"
    "copy:test"
  ]
  # Default task
  grunt.registerTask "default", ["compile_sass", "compile_coffee", "copy:image", "test", "clean"]
