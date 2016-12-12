(function() {
  var Holder,
    __slice = [].slice;

  Holder = function(Backbone, _, MixinBackbone) {
    var $, $body, BootstrapModal, SuperClass;
    SuperClass = MixinBackbone(Backbone.Epoxy.View);
    $ = Backbone.$;
    $body = $("body");
    BootstrapModal = SuperClass.extend({
      modal_keyboard: false,
      modal_backdrop: true,
      autoremove: true,
      layoutManager: function() {
        throw new Error("BootstrapModal::layoutManager need to implement");
      },
      constructor: function() {
        var initialize, remove, removeFlag;
        initialize = this.initialize;
        this.initialize = function(options) {
          options || (options = {});
          this.autoremove = options.autoremove || this.autoremove;
          this.modal_backdrop = options.modal_backdrop || this.modal_backdrop;
          this.modal_keyboard = options.modal_keyboard || this.modal_keyboard;
          this.$modalEl = this.$el.find(".modal");
          this.$modalEl.attr({
            "tabindex": "-1"
          });
          this.listenTo(this, "onShow", function() {
            return $body.addClass("modal-open");
          });
          this.listenTo(this, "onClose", (function(_this) {
            return function() {
              return setTimeout((function() {
                if (_this.autoremove) {
                  return _this.remove();
                }
              }), 0);
            };
          })(this));
          this.async = $.Deferred();
          this.async.promise().always((function(_this) {
            return function() {
              return _this.remove();
            };
          })(this));
          this.isShown = false;
          this._bindModal();
          return initialize != null ? initialize.apply(this, arguments) : void 0;
        };
        remove = this.remove;
        removeFlag = false;
        this.remove = function() {
          if (removeFlag) {
            return;
          }
          removeFlag = true;
          this._unbindModal();
          SuperClass.prototype.remove.apply(this, arguments);
          return remove != null ? remove.apply(this, arguments) : void 0;
        };
        return SuperClass.prototype.constructor.apply(this, arguments);
      },
      showAnimation: function(callback) {
        if (this.isShown === true) {
          return typeof callback === "function" ? callback() : void 0;
        }
        this._bindModal();
        this.$modalEl.one("shown.bs.modal", (function(_this) {
          return function() {
            _this.isShown = true;
            return typeof callback === "function" ? callback() : void 0;
          };
        })(this));
        return this.$modalEl.modal({
          backdrop: this.modal_backdrop,
          show: true,
          keyboard: this.modal_keyboard
        });
      },
      closeAnimation: function(callback) {
        if (this.isShown === false) {
          return typeof callback === "function" ? callback() : void 0;
        }
        this._unbindModal();
        this.$modalEl.one("hidden.bs.modal", (function(_this) {
          return function() {
            _this.isShown = false;
            return typeof callback === "function" ? callback() : void 0;
          };
        })(this));
        return this.$modalEl.modal("hide");
      },
      showModal: function() {
        this.layoutManager().show(this);
        return this.async.promise();
      },
      showChainModal: function() {
        var ViewModal, autoremove, options, params, view;
        ViewModal = arguments[0], options = arguments[1], params = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
        autoremove = this.autoremove;
        this.setAutoremove(false);
        this.closeCurrent(null, this.layoutManager());
        view = new ViewModal(options);
        return view.showModal.apply(view, params).always((function(_this) {
          return function() {
            _this.setAutoremove(autoremove);
            return _this.showCurrent(null, _this.layoutManager());
          };
        })(this));
      },
      ok: function(data) {
        if (data == null) {
          data = {};
        }
        this.layoutManager().close(this, (function(_this) {
          return function() {
            return _this.async.resolve(data);
          };
        })(this));
        return this.async.promise();
      },
      cancel: function(err) {
        if (err == null) {
          err = "error";
        }
        this.layoutManager().close(this, (function(_this) {
          return function() {
            return _this.async.reject(err);
          };
        })(this));
        return this.async.promise();
      },
      setAutoremove: function(autoremove) {
        this.autoremove = autoremove != null ? autoremove : true;
      },
      _bindModal: function() {
        this._unbindModal();
        return this.$modalEl.on("hidden.bs.modal", (function(_this) {
          return function() {
            _this.isShown = false;
            return _this.cancel("hide modal");
          };
        })(this));
      },
      _unbindModal: function() {
        return this.$modalEl.off("hidden.bs.modal");
      }
    });
    BootstrapModal.version = '0.1.1';
    return BootstrapModal;
  };

  if ((typeof define === 'function') && (typeof define.amd === 'object') && define.amd) {
    define(["backbone", "underscore", 'backbone-mixin', 'epoxy', "bootstrap"], function(Backbone, _, MixinBackbone) {
      return Holder(Backbone, _, MixinBackbone);
    });
  } else {
    window.BootstrapModal = Holder(Backbone, _, MixinBackbone);
  }

}).call(this);
