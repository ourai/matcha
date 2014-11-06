do ( _H ) ->
  # Set a default tab
  $ ->
    $(".Tabs[data-setdefault!='false'] > .Tabs-triggers").each ->
      group = $(this)
      selector = ".Tabs-trigger"

      if $("#{selector}.is-selected", group).size() is 0
        $("#{selector}:first", group).trigger "click"

    $(".Tabs-trigger.is-selected").trigger "click"

# Tabs
$(document).on "click", hook("tabs.trigger"), ->
  trigger = $(this)
  tabs = trigger.closest ".Tabs"
  type = trigger.data "flag"

  $(".Tabs-trigger.is-selected, .Tabs-content.is-selected", tabs).removeClass "is-selected"
  $(".Tabs-content[data-flag='#{type}']", tabs)
    .add trigger
    .addClass "is-selected"

  trigger.triggerHandler eventName("change"), [type]

  return false
