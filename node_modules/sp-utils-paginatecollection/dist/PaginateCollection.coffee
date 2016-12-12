HolderPaginateCollection = (Backbone, _)->
  PaginateModel = Backbone.Model.extend

    initialize:->
      @listenTo this, "change:page", @onChangePage
      @listenTo this, "change:params", @onChangeParams

      @listenTo this, "change:page", @onUpdateNextPrev
      @listenTo this, "change:pages", @onUpdateNextPrev

      @listenTo this, "change:total", @onUpdatePages
      @listenTo this, "change:pagesize", @onUpdatePages

      @listenTo this, "change:page", @onUpdateOffset
      @listenTo this, "change:pagesize", @onUpdateOffset
      @refreshMode = true

    defaults:
      sync: false
      itemscount: 0
      page:0
      pagesize:10
      total:0
      params:{}
      offset:0
      pages:0
      has_next: true
      has_prev: false
      _needReset: false

    setPage: (page)->
      @refreshMode = false
      prevpage = @get "page"
      _needReset = @get('_needReset') or
        Math.abs(prevpage - page) isnt 1
      @set {page, _needReset}
      @refreshMode = true
      @refresh()

    refresh: (options={}, funcname="impl_refresh")->
      if @refreshMode
        @collection[funcname](this, options)
          .done (data)=>
            paginate=@collection.impl_parse_paginate(
              data, this
            )
            @set @parse(paginate)
            @collection.fillData(data)

    updateParams: (_params, options)->
      params = _.clone @get("params")
      _.extend params, _params
      @set {params}, options

    onChangePage: ->
      @refresh()

    onChangeParams: (model, params)->
      @refreshMode = false
      @set {page: 0, _needReset: true}
      @refreshMode = true
      @refresh()

    onUpdateOffset: (model)->
      return if model.changed.offset?
      offset = model.get("page") * model.get("pagesize")
      model.set {offset}

    onUpdateNextPrev: (model)->
      return if model.changed.has_next? or model.changed.has_prev?
      page = model.get("page")
      pages = model.get("pages")
      has_next = page >= 0 && page + 1 < pages
      has_prev = page > 0 && page < pages
      model.set {has_next, has_prev}


    onUpdatePages: (model)->
      return if model.changed.pages?
      pages = Math.ceil(
        1.0 * model.get("total") / model.get("pagesize")
      )
      model.set {pages}, {silent: true}

    parse:(r)->
      keys = _.chain(this).result("defaults").keys().value()
      _.pick r, keys


  PaginateCollection = Backbone.Collection.extend
    constructor:->
      @meta = new PaginateModel
      @meta.collection = this
      Backbone.Collection::constructor.apply this, arguments

    impl_refresh:(meta)->
      throw new Error("PaginateCollection::impl_refresh need to implement")

    impl_parse_paginate:(data, meta)->
      throw new Error("PaginateCollection::impl_parse_paginate need to implement")

    set: (val, options)->
      Backbone.Collection::set.apply this, arguments
      @trigger "set", val, options

    fillData:(data)->
      if @meta.get "_needReset"
        @remove @models
        @meta.set {_needReset: false}
      @add data, {parse: true}
      @meta.set {itemscount: @size(), sync: true}

    initMeta:(options)->
      @meta.set @meta.parse(options), {silent:true}
      this

    setPage:(page, forse=false)->
      if page < 0 or (!forse and page == @get("page"))
        return $.Deferred().reject(false)
      @meta.setPage page

    updateParams:(params)->
      @meta.updateParams params

    pageBy:(offset=1, forse=false)->
      page = @meta.get("page") + offset
      if page < 0 or page >= @meta.get("pages")
        $.Deferred().reject(false)
      else
        @setPage page, forse

  PaginateCollection.version = '0.0.3'
  PaginateCollection

if (typeof define is 'function') and (typeof define.amd is 'object') and define.amd
  define ["backbone", "underscore"], (Backbone, _)->
    HolderPaginateCollection(Backbone, _)
else
  window.PaginateCollection = HolderPaginateCollection(Backbone, _)
