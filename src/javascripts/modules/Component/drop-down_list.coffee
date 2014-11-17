do ( _H ) ->
  $ ->
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
