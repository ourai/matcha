class Score extends CustomComponent
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
            <a class="Score-level Score-level-#{score}" href="javascript:void(0);"><label for="#{id}">#{score}</label></a>
            """

  defaults:
    highest: 5

  initialize: ( $el, opts ) ->
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

_H.addComponent "score", initializer Score, ->
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
