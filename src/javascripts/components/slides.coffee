do ->
  class Slides extends Component
    defaults:
      # 目标元素（jQuery 对象）
      $el: null
      # 是否为垂直滑动
      vertical: false
      # 方向，0 代表上一个，1 代表下一个
      dir: 1
      # 动态效果，值可为 "fade"、"slide"，其他值时无效果
      effect: "fade"
      # 自动播放
      auto: false
      # 自动播放的时间间隔，以秒为单位
      interval: 5
      # 是否分页
      pageable: false
      # 本地化
      locale:
        prev: "Prev"
        next: "Next"

    # 初始化单个 slides
    initialize: ( $el, opts ) ->
      effect = opts.effect
      cls = "is-active"

      $el
        .wrap "<div class=\"Slides-wrapper\" />"
        .addClass "Slides"
        .data dataFlag("SlidesEffect"), effect
        .children "li"
        .addClass "Slides-unit"
        .eq 0
        .addClass cls

      wrapper = $el.parent()

      # 可分页
      if isTrue(opts.pageable)
        $ "<div class=\"Slides-pagination\"><ol>#{pageNumHtml($el.children("li"))}</ol></div>"
          .find "li:first"
          .addClass cls
          .closest ".Slides-pagination"
          .appendTo wrapper

      # 自动切换
      if isTrue(opts.auto)
        autoSlide $el, (if $.isNumeric(opts.interval) then opts.interval else defaults.interval) * 1000, effect
      else
        wrapper.append "<div class=\"Slides-triggers\">#{triggerHtml("prev", opts.locale.prev)}#{triggerHtml("next", opts.locale.next)}</div>"

      return wrapper

  # 页码的 HTML
  pageNumHtml = ( units ) ->
    html = []

    units.each ( idx ) ->
      pageNum = idx + 1

      $(@).data dataFlag("SlidesPageNum"), pageNum

      html.push "<li><a href=\"#\" data-page=\"#{pageNum}\">#{pageNum}</a></li>"

    return html.join ""

  # 自动切换
  autoSlide = ( slides, interval, effect ) ->
    setTimeout ->
      changeUnit slides.children("li.is-active"), nextUnit(slides, 1), 1, effect, ->
        autoSlide slides, interval, effect
    , interval

    return

  # 获取 trigger 的 HTML
  triggerHtml = ( dir, text = "" ) ->
    return "<button type=\"button\" class=\"Slides-trigger\" data-direction=\"#{dir}\">#{text}</button>"

  # 切换幻灯片
  changeUnit = ( curr, next, dir, effect, callback ) ->
    nextCls = "is-next"

    next.addClass nextCls

    slidesEffect curr, dir, effect, ->
      currCls = "is-active"

      next
        .removeClass nextCls
        .addClass currCls

      curr
        .removeClass currCls
        .show()

      pagination = curr.closest(".Slides-wrapper").children ".Slides-pagination"

      # 更新页码状态
      if pagination.size()
        $("[data-page='#{next.data(dataFlag("SlidesPageNum"))}']", pagination)
          .parent()
          .addClass currCls
          .siblings ".#{currCls}"
          .removeClass currCls

      callback?()

    return next

  # 获取下一个单元
  nextUnit = ( slides, dir, index = -1 ) ->
    if index is -1
      curr = slides.children "li.is-active"

      # 上翻
      if dir is 0
        if curr.is(":first-child")
          next = slides.children "li:last-child"
        else
          next = curr.prev()
      # 下翻
      else
        if curr.is(":last-child")
          next = slides.children "li:first-child"
        else
          next = curr.next()
    else
      next = slides.children "li:eq(#{index})"

    return next

  # 使用动态效果
  slidesEffect = ( unit, dir, effect, handler ) ->
    # 淡出效果
    if effect is "fade"
      unit.fadeOut handler
    # 滑动效果
    else if effect is "slide"
      slideToEffect unit, dir, handler
    # 无动态效果
    else
      handler()

    return

  # 滑动效果
  slideToEffect = ( unit, dir, handler ) ->
    if dir is 0
      prop = "right"
    else
      prop = "left"

    value = unit.css prop
    props = {}
    props["#{prop}"] = "-#{unit.outerWidth(true)}"

    unit.animate props, ->
      unit.css prop, value

      handler()

  changeUnitTrigger = ( el, getDirection, index ) ->
    slides = $(el).closest(".Slides-wrapper").children(".Slides")
    curr = slides.children "li.is-active"
    dir = getDirection.call curr

    return changeUnit curr, nextUnit(slides, dir, index), dir, slides.data(dataFlag("SlidesEffect"))

  LIB.addComponent "slides", createComponent(Slides)

  # 上一个/下一个
  $(document).on "click", ".Slides-trigger", ->
    changeUnitTrigger @, =>
      return if $(@).attr("data-direction") is "prev" then 0 else 1

    return false

  # 翻页
  $(document).on "click", ".Slides-pagination a", ->
    nextPage = $(@).parent()

    if not nextPage.is(".is-active")
      pageNum = Number $("a", nextPage).attr("data-page")

      changeUnitTrigger @, ->
        return if pageNum > Number($("a", nextPage.siblings(".is-active")).attr("data-page")) then 1 else 0
      , pageNum - 1

    return false
