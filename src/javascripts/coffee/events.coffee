# Tabs
$(document).on "click", hook("tabs.trigger"), ->
  trigger = $(this)
  tabs = trigger.closest ".Tabs"

  $(".Tabs-trigger.is-selected, .Tabs-content.is-selected", tabs).removeClass "is-selected"
  $(".Tabs-content[data-flag='#{trigger.data "flag"}']", tabs)
    .add trigger
    .addClass "is-selected"

  return false

# Scores / Levels of evaluation
$(document).on "click", hook("score.trigger"), ->
  t = $(this)
  cls = "is-selected"

  t.siblings(".#{cls}").removeClass(cls)
  t.addClass cls

  t.siblings("[checked]").attr("checked", false)
  t.prev(":radio").attr("checked", true)

  return false
