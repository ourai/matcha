$ ->
  score_html = ( data ) ->
    score = data.score
    id = "#{data.name}-#{score}"

    return """
            <input id="#{id}" class="Score-storage Score-storage-#{score}" type="radio" name="#{data.name}" value="#{score}">
            <a class="Score-level Score-level-#{score}" href="http://www.baidu.com/">
              <label for="#{id}">#{score}</label>
            </a>
           """

  $(".Score--selectable").each ->
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
      __e.append score_html data

    return true
