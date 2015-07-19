__LIB.mask LIB_CONFIG.name

defineProp = ( key, value ) ->
  prop = {}
  prop[key] = value

  if __LIB[key]?
    __LIB.mixin prop
  else
    try
      Object.defineProperty __LIB, key,
        __proto__: null
        writable: true
        value: value
    catch e
      __LIB.mixin prop
  
  return value

defineProp "__class__", {Component: CustomComponent}

defineProp "__meta__", LIB_CONFIG
