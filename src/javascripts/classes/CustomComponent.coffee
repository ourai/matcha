class CustomComponent
  ##
  # Functions
  # ==========
  # for internal use
  #

  html2dataset = ( html ) ->
    dataset = {}

    $.each html.match(/<[a-z]+[^>]*>/i)?[0].match(/(data(-[a-z]+)+=[^\s>]*)/ig) or [], ( attr ) ->
      attr = attr.match /data-(.*)="([^\s"]*)"/i
      dataset[$.camelCase(attr[1])] = attr[2]

      return true

    return dataset

  attr2dataset = ( attrs ) ->
    dataset = {}

    $.each attrs, ( attr ) ->
      dataset[$.camelCase(match(1))] = attr.nodeValue if attr.nodeType is 2 and (match = attr.nodeName.match(/^data-(.*)$/i))?

      return true

    return dataset

  ##
  # Prototype properties and methods
  # ==========
  # for instances
  #

  # 构造函数
  # 根据传入的配置参数对元素集合进行初始化
  constructor: ( $el = $(), opts = {} ) ->
    if $.isPlainObject($el)
      opts = $el
      $el = opts.$el ? $()
    else
      opts.$el = $el

    $el.each ( idx, el ) =>
      @initialize $(el), $.extend(true, {}, @defaults ? {}, opts, @dataset(el)), opts

      return

  # 默认配置
  defaults: null

  # 最外层的包装
  wrapper: null

  # 根据传入的配置参数对单个元素进行初始化
  initialize: ( $el, mergedOpts, rawOpts ) ->
    # Do something by yourself

  # 获取 DOM 的 dataset
  dataset: ( el = @el ) ->
    if el.dataset?
      dataset = el.dataset
    else if el.outerHTML?
      dataset = html2dataset el.outerHTML
    else if el.attributes? and $.isNumeric(el.attributes.length)
      dataset = attr2dataset el.attributes
    else
      dataset = {}

    return dataset
