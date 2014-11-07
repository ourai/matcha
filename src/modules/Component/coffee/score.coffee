do ( _H ) ->
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

  # Construct levels of evaluation
  $ ->
    $(".Score--selectable[data-highest]").each ->
      __e = $(this)

      highest = Number __e.data("highest")
      lowest = 1
      data = {}

      __e.width highest * 16

      data.name = __e.data("name") || "Score-#{$(".Score--selectable").index(__e) + 1}"

      if isNaN highest
        highest = 0
      else
        highest += 1

      while lowest < highest
        data.score = lowest++
        __e.append scoreHtml data

      return true

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
