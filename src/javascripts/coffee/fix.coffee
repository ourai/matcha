$ ->
  if $.browser.msie 
    ie_ver = $.browser.version * 1

    # Scores / Levels of evaluation
    $(".Score--selectable .Score-level").addClass("js-trigger--score") if ie_ver < 9
