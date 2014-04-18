# Scores / Levels of evaluation
if $.browser.msie and $.browser.version * 1 < 9
  $(".js-levelTrigger").live "click", ->
    t = $(this)
    cls = "is-selected"

    t.siblings(".#{cls}").removeClass(cls)
    t.addClass cls

    t.siblings("[checked]").attr("checked", false)
    t.prev(":radio").attr("checked", true)

    return false

  $ ->
    $(".Score-level").addClass("js-levelTrigger")
