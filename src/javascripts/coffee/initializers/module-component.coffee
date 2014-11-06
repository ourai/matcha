# 添加 UI 组件
_H.addComponent = ( name, func ) ->
  (new storage.modules.Component name, func).register()

  return func
