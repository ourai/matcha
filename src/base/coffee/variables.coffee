# Main objects
_H = {}

$ = jQuery

# 内部数据载体
storage =
  ###
  # 模块
  #
  # @property   modules
  # @type       {Object}
  ###
  modules: {}

  ###
  # 已注册组件
  #
  # @property   components
  # @type       {Object}
  ###
  components: {}

  ###
  # JavaScript 钩子
  #
  # @property   hook
  # @type       {Object}
  ###
  hook:
    tabs:
      component: "tabs"
      trigger: "trigger--tab"
      content: "tabs-content"
    score:
      trigger: "trigger--score"
    dropdown:
      trigger: "trigger--dropdown"
    uploader:
      trigger: "trigger--uploader"
      label: "label--uploader"

browser = do ->
  ua = window.navigator.userAgent.toLowerCase()

  # jQuery 1.9.x 以下版本中 jQuery.browser 的实现方式
  # IE 只能检测 IE11 以下
  jQueryBrowser = ->
    browser = {}
    match = /(chrome)[ \/]([\w.]+)/.exec(ua) or
            /(webkit)[ \/]([\w.]+)/.exec(ua) or
            /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua) or
            /(msie) ([\w.]+)/.exec(ua) or
            ua.indexOf("compatible") < 0 and /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) or
            []
    result =
      browser: match[1] or ""
      version: match[2] or "0"

    if result.browser
      browser[result.browser] = true
      browser.version = result.version

    if browser.chrome
      browser.webkit = true
    else if browser.webkit
      browser.safari = true

    return browser

  detectBrowser = ->
    # IE11 及以上
    match = /trident.*? rv:([\w.]+)/.exec(ua)

    if match
      browser =
        msie: true
        version: match[1]
    else
      browser = jQueryBrowser()

      if browser.mozilla
        browser.firefox = true
        match = /firefox[ \/]([\w.]+)/.exec(ua)
        browser.version = match[1] if match

    browser.language = navigator.language or navigator.browserLanguage

    return browser

  return detectBrowser()
