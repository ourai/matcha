LIB.extend
  handlers: [
    {
      ###
      # 添加 UI 组件
      #
      # @method   addComponent
      # @param    name {String}
      # @param    func {Function}
      # @return   {Function/Boolean}
      ###
      name: "addComponent"

      handler: ( name, func ) ->
        # 组件是否已保存
        if @hasProp(storage.components, name)
          throw "The component '#{name}' exists."
        # 组件名是否与已暴露到全局对象上的属性名冲突
        else if @hasProp(name)
          throw "Wrong component's name!!!"
        else
          LIB[name] = storage.components[name] = func

        return func

      validator: ( name, func ) ->
        return @isString(name) and @isFunction(func)

      value: false
    }
  ]
