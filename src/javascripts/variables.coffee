$ = jQuery

# 内部数据载体
storage =
  ###
  # 已注册组件
  #
  # @property   components
  # @type       {Object}
  ###
  components: {}

  ###
  # JavaScript 钩子
  #
  # @property   hook
  # @type       {Object}
  ###
  hook:
    tabs:
      component: "tabs"
      trigger: "trigger--tab"
      content: "tabs-content"
    score:
      trigger: "trigger--score"
    dropdown:
      trigger: "trigger--dropdown"
    uploader:
      trigger: "trigger--uploader"
      label: "label--uploader"
