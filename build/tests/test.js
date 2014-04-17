$(function() {
  var score_html;
  score_html = function(data) {
    var id, score;
    score = data.score;
    id = "" + data.name + "-" + score;
    return "<input id=\"" + id + "\" class=\"Score-storage Score-storage-" + score + "\" type=\"radio\" name=\"" + data.name + "\" value=\"" + score + "\">\n <a class=\"Score-level Score-level-" + score + "\" href=\"http://www.baidu.com/\">\n   <label for=\"" + id + "\">" + score + "</label>\n </a>";
  };
  return $(".Score--checkable").each(function() {
    var data, highest, lowest, __e;
    __e = $(this);
    highest = Number(__e.data("highest"));
    lowest = 1;
    data = {};
    __e.width(highest * 16);
    data.name = __e.data("name") || ("Score-" + ($(".Score--checkable").index(__e) + 1));
    if (isNaN(highest)) {
      highest = 0;
    } else {
      highest += 1;
    }
    while (lowest < highest) {
      data.score = lowest++;
      __e.append(score_html(data));
    }
    return true;
  });
});
