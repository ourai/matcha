$(function() {
  return Matcha.slides($("#slidesDemo ul"), {
    auto: false,
    interval: 3,
    effect: "fade",
    pageable: true,
    locale: {
      prev: "上一个",
      next: "下一个"
    }
  });
});
