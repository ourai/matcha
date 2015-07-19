$(function() {
  return Matcha.slides($("#slidesDemo ul"), {
    auto: false,
    interval: 3,
    locale: {
      prev: "上一个",
      next: "下一个"
    }
  });
});
