LIB.mask META.name

defineProp = ( key, value ) ->
  prop = {}
  prop[key] = value

  if LIB[key]?
    LIB.mixin prop
  else
    try
      Object.defineProperty LIB, key,
        __proto__: null
        writable: true
        value: value
    catch e
      LIB.mixin prop
  
  return value

defineProp "__class__", {Component}

defineProp "__meta__", META
