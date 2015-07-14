do ( _H ) ->
  defaults =
    $el: null
    highest: 5

  initScore = ( $el, opts ) ->
    highest = Number opts.highest
    lowest = 1
    data = {}

    $el.width highest * 16

    data.name = opts.name or "Score-#{$(".Score--selectable").index($el) + 1}"

    if isNaN(highest)
      highest = 0
    else
      highest++

    while lowest < highest
      data.score = lowest++
      $el.append scoreHtml(data)

    return

  ###
  # Construct HTML string for score
  #
  # @private
  # @method   scoreHtml
  # @param    data {Object}
  # @return   {String}
  ###
  scoreHtml = ( data ) ->
    score = data.score
    id = "#{data.name}-#{score}"

    return  """
            <input id="#{id}" class="Score-storage Score-storage-#{score}" type="radio" name="#{data.name}" value="#{score}">
            <a class="Score-level Score-level-#{score}" href="http://www.baidu.com/">
              <label for="#{id}">#{score}</label>
            </a>
            """

  _H.addComponent "score", ( $el, settings = {} ) ->
    if $.isPlainObject($el)
      settings = $el
      $el = settings.$el
    else
      settings.$el = $el

    # Construct levels of evaluation
    $el.each ->
      initScore $(@), $.extend(true, {}, defaults, settings, nodeDataset(@))

    $(".Score--selectable .Score-level").addClass(hook("score.trigger", true)) if needFix(9)

  # Scores / Levels of evaluation
  $(document).on "click", hook("score.trigger"), ->
    t = $(this)
    cls = "is-selected"

    t.siblings(".#{cls}").removeClass(cls)
    t.addClass cls

    t.siblings("[checked]").attr("checked", false)
    t.prev(":radio").attr("checked", true)

    t.triggerHandler eventName("select")

    return false
