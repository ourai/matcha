# Set a default tab
setDefaultTab = ->
  $(".Tabs[data-setdefault!='false'] > .Tabs-triggers").each ->
    group = $(this)
    selector = ".Tabs-trigger"

    if $("#{selector}.is-selected", group).size() is 0
      $("#{selector}:first", group).trigger "click"

  $(".Tabs-trigger.is-selected").trigger "click"

# Construct levels of evaluation
scoreLevels = ->
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

$ ->
  setDefaultTab()
  scoreLevels()