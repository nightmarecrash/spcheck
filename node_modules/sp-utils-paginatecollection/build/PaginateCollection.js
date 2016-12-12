(function() {
  var HolderPaginateCollection;

  HolderPaginateCollection = function(Backbone, _) {
    var PaginateCollection, PaginateModel;
    PaginateModel = Backbone.Model.extend({
      initialize: function() {
        this.listenTo(this, "change:page", this.onChangePage);
        this.listenTo(this, "change:params", this.onChangeParams);
        this.listenTo(this, "change:page", this.onUpdateNextPrev);
        this.listenTo(this, "change:pages", this.onUpdateNextPrev);
        this.listenTo(this, "change:total", this.onUpdatePages);
        this.listenTo(this, "change:pagesize", this.onUpdatePages);
        this.listenTo(this, "change:page", this.onUpdateOffset);
        this.listenTo(this, "change:pagesize", this.onUpdateOffset);
        return this.refreshMode = true;
      },
      defaults: {
        sync: false,
        itemscount: 0,
        page: 0,
        pagesize: 10,
        total: 0,
        params: {},
        offset: 0,
        pages: 0,
        has_next: true,
        has_prev: false,
        _needReset: false
      },
      setPage: function(page) {
        var prevpage, _needReset;
        this.refreshMode = false;
        prevpage = this.get("page");
        _needReset = this.get('_needReset') || Math.abs(prevpage - page) !== 1;
        this.set({
          page: page,
          _needReset: _needReset
        });
        this.refreshMode = true;
        return this.refresh();
      },
      refresh: function(options, funcname) {
        if (options == null) {
          options = {};
        }
        if (funcname == null) {
          funcname = "impl_refresh";
        }
        if (this.refreshMode) {
          return this.collection[funcname](this, options).done((function(_this) {
            return function(data) {
              var paginate;
              paginate = _this.collection.impl_parse_paginate(data, _this);
              _this.set(_this.parse(paginate));
              return _this.collection.fillData(data);
            };
          })(this));
        }
      },
      updateParams: function(_params, options) {
        var params;
        params = _.clone(this.get("params"));
        _.extend(params, _params);
        return this.set({
          params: params
        }, options);
      },
      onChangePage: function() {
        return this.refresh();
      },
      onChangeParams: function(model, params) {
        this.refreshMode = false;
        this.set({
          page: 0,
          _needReset: true
        });
        this.refreshMode = true;
        return this.refresh();
      },
      onUpdateOffset: function(model) {
        var offset;
        if (model.changed.offset != null) {
          return;
        }
        offset = model.get("page") * model.get("pagesize");
        return model.set({
          offset: offset
        });
      },
      onUpdateNextPrev: function(model) {
        var has_next, has_prev, page, pages;
        if ((model.changed.has_next != null) || (model.changed.has_prev != null)) {
          return;
        }
        page = model.get("page");
        pages = model.get("pages");
        has_next = page >= 0 && page + 1 < pages;
        has_prev = page > 0 && page < pages;
        return model.set({
          has_next: has_next,
          has_prev: has_prev
        });
      },
      onUpdatePages: function(model) {
        var pages;
        if (model.changed.pages != null) {
          return;
        }
        pages = Math.ceil(1.0 * model.get("total") / model.get("pagesize"));
        return model.set({
          pages: pages
        }, {
          silent: true
        });
      },
      parse: function(r) {
        var keys;
        keys = _.chain(this).result("defaults").keys().value();
        return _.pick(r, keys);
      }
    });
    PaginateCollection = Backbone.Collection.extend({
      constructor: function() {
        this.meta = new PaginateModel;
        this.meta.collection = this;
        return Backbone.Collection.prototype.constructor.apply(this, arguments);
      },
      impl_refresh: function(meta) {
        throw new Error("PaginateCollection::impl_refresh need to implement");
      },
      impl_parse_paginate: function(data, meta) {
        throw new Error("PaginateCollection::impl_parse_paginate need to implement");
      },
      set: function(val, options) {
        Backbone.Collection.prototype.set.apply(this, arguments);
        return this.trigger("set", val, options);
      },
      fillData: function(data) {
        if (this.meta.get("_needReset")) {
          this.remove(this.models);
          this.meta.set({
            _needReset: false
          });
        }
        this.add(data, {
          parse: true
        });
        return this.meta.set({
          itemscount: this.size(),
          sync: true
        });
      },
      initMeta: function(options) {
        this.meta.set(this.meta.parse(options), {
          silent: true
        });
        return this;
      },
      setPage: function(page, forse) {
        if (forse == null) {
          forse = false;
        }
        if (page < 0 || (!forse && page === this.get("page"))) {
          return $.Deferred().reject(false);
        }
        return this.meta.setPage(page);
      },
      updateParams: function(params) {
        return this.meta.updateParams(params);
      },
      pageBy: function(offset, forse) {
        var page;
        if (offset == null) {
          offset = 1;
        }
        if (forse == null) {
          forse = false;
        }
        page = this.meta.get("page") + offset;
        if (page < 0 || page >= this.meta.get("pages")) {
          return $.Deferred().reject(false);
        } else {
          return this.setPage(page, forse);
        }
      }
    });
    PaginateCollection.version = '0.0.3';
    return PaginateCollection;
  };

  if ((typeof define === 'function') && (typeof define.amd === 'object') && define.amd) {
    define(["backbone", "underscore"], function(Backbone, _) {
      return HolderPaginateCollection(Backbone, _);
    });
  } else {
    window.PaginateCollection = HolderPaginateCollection(Backbone, _);
  }

}).call(this);
