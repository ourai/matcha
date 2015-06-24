class Component
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
      dataset[$.camelCase(attr[1])] = convert attr[2]

      return true

    return dataset

  attr2dataset = ( attrs ) ->
    dataset = {}

    $.each attrs, ( attr ) ->
      dataset[$.camelCase(match(1))] = convert(attr.nodeValue) if attr.nodeType is 2 and (match = attr.nodeName.match(/^data-(.*)$/i))?

      return true

    return dataset

  constructor: ( el, opts ) ->
    @el = el
    @$el = $ el

    @__defaults = {}

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
