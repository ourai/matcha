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
      trigger: "tabs-trigger"
      content: "tabs-content"

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
  return (if no_dot is true then "" else ".") + "js-" + $.camelCase(getStorageData("hook.#{name}"))

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

$ ->
  if $.browser.msie 
    ie_ver = $.browser.version * 1

    # Scores / Levels of evaluation
    $(".Score--selectable .Score-level").addClass("js-trigger--score") if ie_ver < 9

# Scores / Levels of evaluation
$(".js-trigger--score").live "click", ->
  t = $(this)
  cls = "is-selected"

  t.siblings(".#{cls}").removeClass(cls)
  t.addClass cls

  t.siblings("[checked]").attr("checked", false)
  t.prev(":radio").attr("checked", true)

  return false

window[LIB_CONFIG.name] = _H
