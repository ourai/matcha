# 初始化
$(document).ready ->
  _H.score $(".Score--selectable[data-highest]")
  _H.dropdown $("select.DropList")

window[LIB_CONFIG.name] = _H
