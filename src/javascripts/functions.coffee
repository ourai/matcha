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
# 获取 data 的标识
###
dataFlag = ( flag ) ->
  return "#{LIB_CONFIG.name}.#{flag}"

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

nodeDataset = ( dom ) ->
  if dom.dataset?
    dataset = dom.dataset
  else if dom.outerHTML?
    dataset = getDatasetByHTML dom.outerHTML
  else if dom.attributes? and $.isNumeric(dom.attributes.length)
    dataset = getDatasetByAttrs dom.attributes
  else
    dataset = {}

  return dataset

getDatasetByHTML = ( html ) ->
  dataset = {}

  if (fragment = html.match /<[a-z]+[^>]*>/i)?
    $.each fragment[0].match(/(data(-[a-z]+)+=[^\s>]*)/ig) or [], ( attr ) ->
      attr = attr.match /data-(.*)="([^\s"]*)"/i
      dataset[$.camelCase(attr[1])] = attr[2]

      return true

  return dataset

getDatasetByAttrs = ( attrs ) ->
  dataset = {}

  $.each attrs, ( attr ) ->
    dataset[$.camelCase(match(1))] = attr.nodeValue if attr.nodeType is 2 and (match = attr.nodeName.match(/^data-(.*)$/i))?

    return true

  return dataset

isTrue = ( value ) ->
  return value in [true, "true"]

isFalse = ( value ) ->
  return value in [false, "false"]

initializer = ( componentClass, callback ) ->
  return ( $el, settings ) ->
    inst = new componentClass $el, settings

    callback?()

    return inst
