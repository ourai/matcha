do ( _H ) ->
  defaults =
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

  # 初始化单个 slides
  initSlides = ( $el, opts ) ->
    effect = opts.effect
    wrapper = $el.parent()

    $el
      .addClass "Slides"
      .data dataFlag("SlidesEffect"), effect
      .children "li"
      .addClass "Slides-unit"
      .eq 0
      .addClass "is-active"

    # 可分页
    if opts.pageable is true
    else

    # 自动切换
    if opts.auto is true
      autoSlide $el, (if $.isNumeric(opts.interval) then opts.interval else defaults.interval) * 1000, effect
    else
      wrapper.append "<div class=\"Slides-triggers\">#{triggerHtml("prev")}#{triggerHtml("next")}</div>"

    return wrapper

  # 自动切换
  autoSlide = ( slides, interval, effect ) ->
    setTimeout ->
      changeUnit slides, 1, effect, ->
        autoSlide slides, interval, effect
    , interval

    return

  # 获取 trigger 的 HTML
  triggerHtml = ( dir, text = "" ) ->
    return "<button type=\"button\" class=\"Slides-trigger\" data-direction=\"#{dir}\">#{text}</button>"

  # 切换幻灯片
  changeUnit = ( slides, dir, effect, callback ) ->
    currCls = "is-active"
    nextCls = "is-next"

    curr = slides.children "li.#{currCls}"
    next = nextUnit curr, slides, dir

    next.addClass nextCls

    slidesEffect curr, effect, ->
      next
        .removeClass nextCls
        .addClass currCls

      curr
        .removeClass currCls
        .show()

      callback?()

    return next

  # 获取下一个单元
  nextUnit = ( unit, slides, dir ) ->
    # 上翻
    if dir is 0
      if unit.is(":first-child")
        next = slides.children "li:last-child"
      else
        next = unit.prev()
    # 下翻
    else
      if unit.is(":last-child")
        next = slides.children "li:first-child"
      else
        next = unit.next()

    return next

  # 使用动态效果
  slidesEffect = ( unit, effect, handler ) ->
    # 淡出效果
    if effect is "fade"
      unit.fadeOut handler
    # 滑动效果
    else if effect is "slide"
    # 无动态效果
    else
      handler()

    return

  _H.addComponent "slides", ( $el, settings = {} ) ->
    if $.isPlainObject($el)
      settings = $el
      $el = settings.$el
    else
      settings.$el = $el

    $el
      .wrap "<div class=\"Slides-wrapper\" />"
      .each ->
        initSlides $(@), $.extend true, {}, defaults, settings

  $(document).on "click", ".Slides-trigger", ->
    slides = $(@).closest(".Slides-wrapper").children ".Slides"

    changeUnit slides, (if $(@).attr("data-direction") is "prev" then 0 else 1), slides.data(dataFlag("SlidesEffect"))

    return false
