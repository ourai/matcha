storage.modules.Component = do ->
  savedComps = storage.components

  class Component
    constructor: ( name, func ) ->
      # 组件是否已保存
      if hasOwnProp(savedComps, name)
        throw "The component '#{name}' exists."
      # 组件名是否与已暴露到全局对象上的属性名冲突
      else if hasOwnProp(_H, name)
        throw "Wrong component's name!!!"
      else
        _H[name] = savedComps[name] = func

  return Component

# 添加 UI 组件
_H.addComponent = ( name, func ) ->
  return new storage.modules.Component name, func
