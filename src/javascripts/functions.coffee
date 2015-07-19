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
  return (if no_dot is true then "" else ".") + "js-" + LIB.namespace(storage, "hook.#{name}")

###
# 获取事件名称
###
eventName = ( event_name ) ->
  return "#{event_name}.#{META.name}".toLowerCase()

###
# 获取 data 的标识
###
dataFlag = ( flag ) ->
  return "#{META.name}.#{flag}"

isTrue = ( value ) ->
  return value in [true, "true"]

createComponent = ( componentClass, callback ) ->
  return ( $el, settings ) ->
    inst = new componentClass $el, settings

    callback?()

    return inst
