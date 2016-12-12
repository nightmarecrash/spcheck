class Middleware
  @version = "0.0.4"
  wrap:(args...)->
    self = this
    ->
      innerArguments = arguments
      middleware = args.slice 0, args.length-1
      func = args[args.length-1]
      middlewareCall = (index)=>
        if index >= args.length-1
          return func.apply this, innerArguments

        async = $.Deferred()
        async.promise()
          .done -> middlewareCall index + 1
          .fail => self.rejectQuery?.apply this, innerArguments
        mname = args[index]
        if typeof mname is 'function'
          mname.call this, async, arguments
        else
          self[mname].call this, async, arguments
      middlewareCall(0)

if (typeof define is 'function') and (typeof define.amd is 'object') and define.amd
  define [], -> Middleware
else
  window.Middleware = Middleware
