var Middleware,
  __slice = [].slice;

Middleware = (function() {
  function Middleware() {}

  Middleware.version = "0.0.4";

  Middleware.prototype.wrap = function() {
    var args, self;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    self = this;
    return function() {
      var func, innerArguments, middleware, middlewareCall;
      innerArguments = arguments;
      middleware = args.slice(0, args.length - 1);
      func = args[args.length - 1];
      middlewareCall = (function(_this) {
        return function(index) {
          var async, mname;
          if (index >= args.length - 1) {
            return func.apply(_this, innerArguments);
          }
          async = $.Deferred();
          async.promise().done(function() {
            return middlewareCall(index + 1);
          }).fail(function() {
            var _ref;
            return (_ref = self.rejectQuery) != null ? _ref.apply(_this, innerArguments) : void 0;
          });
          mname = args[index];
          if (typeof mname === 'function') {
            return mname.call(_this, async, arguments);
          } else {
            return self[mname].call(_this, async, arguments);
          }
        };
      })(this);
      return middlewareCall(0);
    };
  };

  return Middleware;

})();

if ((typeof define === 'function') && (typeof define.amd === 'object') && define.amd) {
  define([], function() {
    return Middleware;
  });
} else {
  window.Middleware = Middleware;
}
