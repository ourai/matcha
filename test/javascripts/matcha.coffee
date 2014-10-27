"use strict"

# Config of library
LIB_CONFIG =
  name: "@NAME"
  version: "@VERSION"

# Main objects
_H = {}

# 内部数据载体
storage =
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

###
# 判断某个对象是否有自己的指定属性
#
# !!! 不能用 object.hasOwnProperty(prop) 这种方式，低版本 IE 不支持。
#
# @private
# @method   hasOwnProp
# @return   {Boolean}
###
hasOwnProp = ( obj, prop ) ->
  return Object.prototype.hasOwnProperty.call obj, prop

###
# 获取指定钩子
#
# @private
# @method   hook
# @param    name {String}     Hook's name
# @param    no_dot {Boolean}  Return class when true, default is selector
# @return   {String}
###
hook = ( name, no_dot ) ->
  return (if no_dot is true then "" else ".") + "js-" + getStorageData("hook.#{name}")

###
# 获取事件名称
###
eventName = ( event_name ) ->
  return "#{event_name}.#{LIB_CONFIG.name}".toLowerCase()

###
# Get data from internal storage
#
# @private
# @method   getStorageData
# @param    ns_str {String}   Namespace string
# @return   {String}
###
getStorageData = ( ns_str ) ->
  parts = ns_str.split "."
  result = storage

  $.each parts, ( idx, part ) ->
    rv = hasOwnProp(result, part)
    result = result[part]
    return rv

  return result

###
# Whether to need to fix IE
#
# @private
# @method   needFix
# @param    version {Integer}
# @return   {Boolean}
###
needFix = ( version ) ->
  return browser.msie and browser.version * 1 < version      

###
# Construct HTML string for score
#
# @private
# @method   scoreHtml
# @param    data {Object}
# @return   {String}
###
scoreHtml = ( data ) ->
  score = data.score
  id = "#{data.name}-#{score}"

  return  """
          <input id="#{id}" class="Score-storage Score-storage-#{score}" type="radio" name="#{data.name}" value="#{score}">
          <a class="Score-level Score-level-#{score}" href="http://www.baidu.com/">
            <label for="#{id}">#{score}</label>
          </a>
          """

# Tabs
$(document).on "click", hook("tabs.trigger"), ->
  trigger = $(this)
  tabs = trigger.closest ".Tabs"
  type = trigger.data "flag"

  $(".Tabs-trigger.is-selected, .Tabs-content.is-selected", tabs).removeClass "is-selected"
  $(".Tabs-content[data-flag='#{type}']", tabs)
    .add trigger
    .addClass "is-selected"

  trigger.triggerHandler eventName("change"), [type]

  return false

# Scores / Levels of evaluation
$(document).on "click", hook("score.trigger"), ->
  t = $(this)
  cls = "is-selected"

  t.siblings(".#{cls}").removeClass(cls)
  t.addClass cls

  t.siblings("[checked]").attr("checked", false)
  t.prev(":radio").attr("checked", true)

  t.triggerHandler eventName("select")

  return false

$(document).on "click", hook("dropdown.trigger"), ->
  t = $(this)
  ddl = t.closest(".DropList")
  lst = t.closest ".DropList-list"
  idx = $("li", lst).index t
  cls = "is-selected"

  $(".#{cls}", lst).removeClass cls
  t.addClass cls
  $(".DropList-label", ddl).text t.text()

  sel = ddl.data "#{LIB_CONFIG.name}.DropListDummy"
  $(":selected", sel).attr "selected", false
  $("option:eq(#{idx})", sel).attr "selected", true
  sel.trigger "change"

$(document).on "change", hook("uploader.trigger"), ->
  ipt = $(this)
  label = $(hook("uploader.label"), ipt.closest(".Uploader"))
  files = this.files
  text = "No files selected"
  val = ipt.val()

  if files?
    label.text if files.length then files[0].name else text
  else
    label.text if val is "" then text else val

  return false

# Set a default tab
setDefaultTab = ->
  $(".Tabs[data-setdefault!='false'] > .Tabs-triggers").each ->
    group = $(this)
    selector = ".Tabs-trigger"

    if $("#{selector}.is-selected", group).size() is 0
      $("#{selector}:first", group).trigger "click"

  $(".Tabs-trigger.is-selected").trigger "click"

# Construct levels of evaluation
scoreLevels = ->
  $(".Score--selectable[data-highest]").each ->
    __e = $(this)

    highest = Number __e.data("highest")
    lowest = 1
    data = {}

    __e.width highest * 16

    data.name = __e.data("name") || "Score-#{$(".Score--selectable").index(__e) + 1}"

    if isNaN highest
      highest = 0
    else
      highest += 1

    while lowest < highest
      data.score = lowest++
      __e.append scoreHtml data

    return true

  $(".Score--selectable .Score-level").addClass(hook("score.trigger", true)) if needFix(9)

# Dropdown List
dummySelect = ->
  $("select.DropList").each ->
    sel = $(this)
    selected = $(":selected", sel)
    idx = $("option", sel).index selected

    sel
      .attr "tabindex", -1
      .removeClass "DropList"
      .addClass "DropList--dummy"

    ddl = $("<div>", class: "DropList")

    ddl.append  """
                <div class="DropList-selected"><span class="DropList-label">#{selected.text()}</span></div>
                <div class="DropList-dropdown"><ul class="DropList-list"></ul></div>
                """

    lst = $(".DropList-list", ddl)

    $("option", sel).each ->
      lst.append "<li class=\"#{hook("dropdown.trigger", true)}\">#{$(this).text()}</li>"

    $("li:eq(#{idx})", lst).addClass "is-selected"

    sel.after ddl
    ddl.data "#{LIB_CONFIG.name}.DropListDummy", sel

$ ->
  setDefaultTab()
  scoreLevels()
  dummySelect()

# 初始化组件的规则
initRules = [
    {
      # 组件名
      name: "tab"
      # 允许作为容器的 HTML 标签
      tags: "div"
    },
    {
      name: "button"
      tags: "button div a"
    }
  ]

$.each initRules, ( idx, rule ) ->
  tags = rule.tags.split " "
  _H[rule.name] = ->
    args = arguments
    target = $(args[0])
    opts = args[1]
    cmpts = []

    target.each ->
      if $.inArray(this.tagName.toLowerCase(), tags) > -1
        cmpts.push this

    return $ cmpts

window[LIB_CONFIG.name] = _H
