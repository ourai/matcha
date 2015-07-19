class DropdownList extends Component
  initialize: ( $el, opts ) ->
    selected = $(":selected", $el)
    idx = $("option", $el).index selected

    $el
      .attr "tabindex", -1
      .removeClass "DropList"
      .addClass "DropList--dummy"

    ddl = $("<div>", class: "DropList")

    ddl.append  """
                <div class="DropList-selected"><span class="DropList-label">#{selected.text()}</span></div>
                <div class="DropList-dropdown"><ul class="DropList-list"></ul></div>
                """

    lst = $(".DropList-list", ddl)

    $("option", $el).each ->
      lst.append "<li class=\"#{hook("dropdown.trigger", true)}\">#{$(@).text()}</li>"

    $("li:eq(#{idx})", lst).addClass "is-selected"

    $el.after ddl
    ddl.data dataFlag("DropListDummy"), $el

LIB.addComponent "dropdown", createComponent(DropdownList)

$(document).on "click", hook("dropdown.trigger"), ->
  t = $(@)
  ddl = t.closest(".DropList")
  lst = t.closest ".DropList-list"
  idx = $("li", lst).index t
  cls = "is-selected"

  $(".#{cls}", lst).removeClass cls
  t.addClass cls
  $(".DropList-label", ddl).text t.text()

  sel = ddl.data dataFlag("DropListDummy")
  $(":selected", sel).attr "selected", false
  $("option:eq(#{idx})", sel).attr "selected", true
  sel.trigger "change"
