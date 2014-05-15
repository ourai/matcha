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

# Dropdown List
dummySelect = ->
  $("select.DropList").each ->
    sel = $(this)
    selected = $(":selected", sel)
    idx = $("option", sel).index selected

    sel
      .attr "tabindex", -1
      .removeClass "DropList"
      .addClass "DropList--dummy"

    ddl = $("<div>", class: "DropList")

    ddl.append  """
                <div class="DropList-selected"><span class="DropList-label">#{selected.text()}</span></div>
                <div class="DropList-dropdown"><ul class="DropList-list"></ul></div>
                """

    lst = $(".DropList-list", ddl)

    $("option", sel).each ->
      lst.append "<li class=\"#{hook("dropdown.trigger", true)}\">#{$(this).text()}</li>"

    $("li:eq(#{idx})", lst).addClass "is-selected"

    sel.after ddl
    ddl.data "#{LIB_CONFIG.name}.DropListDummy", sel

$ ->
  setDefaultTab()
  scoreLevels()
  dummySelect()
