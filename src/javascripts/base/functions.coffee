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
