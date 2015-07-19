class DataList extends Component
  defaults:
    source: []
    data: "{%ROOT%}"
    template: ( itemData ) ->
    paginator:
      tiny: false
      container: null
      total: 0
      defaultPage: 0
    update: ->

LIB.addComponent "dataList", createComponent(DataList)
