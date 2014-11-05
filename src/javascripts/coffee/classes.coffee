storage.classes.Component = do ->
  savedComps = {}

  # 组件是否已保存
  isSaved = ( compName ) ->
    return false

  # 保存组件到内存中
  saveComp = ( compName, compConstructor ) ->
    savedComps[compName] = compConstructor

  class Component
    constructor: ( name, func ) ->
      if isSaved name
        throw "The component #{name} has existed."
      else
        @name = name
        saveComp name, func

    # 注册组件
    # 将组件暴露到全局环境中
    register: ->
      result = @registered isnt true

      if result
        _H[@name] = storage.components[@name] = savedComps[@name]
        @registered = true

      return result

  return Component
