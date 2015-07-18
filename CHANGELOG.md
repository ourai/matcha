# Changes

## 0.5.1

### Features
  * 页面布局部分的代码替换成 [Tangram](https://github.com/ourai/tangram)
  * 引入 [Miso](https://github.com/ourai/miso) 并基于它进行开发
  * slides 组件
  * 等比例缩放
    * mixin `aspect_ratio`
    * CSS class `.u-aspectRatio`
  * 使目标元素变圆的 `.u-circle`

### Deprecations
  * 不再默认包含 [normalize.css](https://github.com/necolas/normalize.css)
  * 移除 `card_style`、`tag_unit`、`block_content` 等 mixin

## 0.4.2

### Features
  * mixin `image-set`

### Deprecations
  * 取消对 IE9 以下 IE 浏览器的支持
    * 更新 `.u-coveredBgImage-altWrapper`、`.u-coveredBgImage-alternate` 等 class
    * 更新 `text-hide`、`opacity`、`clearfix` 等 mixin
    * 移除 `ie-opacity`、`hack-ie6` 等 mixin

### Bug fixes
  * #12

## 0.4.1

### Features
  * data list 组件
  * menu 组件
    * mixin `dropdown-element`
    * mixin `special-list`
    * 菜单与子菜单基础样式

### Enhancements
  * Sass 源文件的目录结构模仿 [bootstrap-sass](http://github.com/twbs/bootstrap-sass)
  * 编译后的样式表文件只有 CSS，没有 Sass

## 0.3.1

### Features
  * Typography for Chinese
    * Emphasis
    * Guillemet (Wavy Line)

## 0.2.1

### Enhancements
  * Sandwich 更加抽象化

## 0.2.0

### Features
  * Basic styles
  * Sass helpers
  * UI Components
    * Tabs
    * Score
    * Dropdown-List
    * Button
    * Uploader
  * Layouts
    * Sandwich
    * Frameset
  * CSS3-related
    * animation
    * keyframes
    * user-select
    * linear-gradient
