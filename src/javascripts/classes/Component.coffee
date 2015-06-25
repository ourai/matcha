class Component
  ##
  # Functions
  # ==========
  # for internal use
  #

  convert = ( value ) ->
    if value is "true"
      value = true
    else if value is "false"
      value = false
    else if $.isNumeric(value)
      value = Number value

    return value

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

  getRawOption = ->

  getMergedOption = ->

  ##
  # Prototype properties and methods
  # ==========
  # for instances
  #

  constructor: ( el, opts ) ->
    @el = el
    @$el = $ el

    @__defaults = {}

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

  getOptions: ->
    # 返回全部配置项

  getOption: ( optName ) ->
    # 返回指定配置项
