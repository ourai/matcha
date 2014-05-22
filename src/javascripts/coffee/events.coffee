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

$(document).on "click", hook("dropdown.trigger"), ->
  t = $(this)
  ddl = t.closest(".DropList")
  lst = t.closest ".DropList-list"
  idx = $("li", lst).index t
  cls = "is-selected"

  $(".#{cls}", lst).removeClass cls
  t.addClass cls
  $(".DropList-label", ddl).text t.text()

  sel = ddl.data "#{LIB_CONFIG.name}.DropListDummy"
  $(":selected", sel).attr "selected", false
  $("option:eq(#{idx})", sel).attr "selected", true
  sel.trigger "change"

$(document).on "change", hook("uploader.trigger"), ->
  ipt = $(this)
  label = $(hook("uploader.label"), ipt.closest(".Uploader"))
  files = this.files
  text = "No files selected"
  val = ipt.val()

  if files?
    label.text if files.length then files[0].name else text
  else
    label.text if val is "" then text else val

  return false
