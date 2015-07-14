# 初始化
$(document).ready ->
  _H.score $(".Score--selectable[data-highest]")

window[LIB_CONFIG.name] = _H
