Simple blocks - Frontend blocks
==========
[![Build Status](https://travis-ci.org/lexich/simple-blocks.svg)](https://travis-ci.org/lexich/simple-blocks)
[![Bower version](https://badge.fury.io/bo/simple-blocks.svg)](http://badge.fury.io/bo/simple-blocks)
[![Coverage Status](https://coveralls.io/repos/lexich/simple-blocks/badge.png?branch=master)](https://coveralls.io/r/lexich/simple-blocks?branch=master)
[![Dependency Status](https://david-dm.org/lexich/simple-blocks.svg)](https://david-dm.org/lexich/simple-blocks)
[![devDependency Status](https://david-dm.org/lexich/simple-blocks/dev-status.svg)](https://david-dm.org/lexich/simple-blocks#info=devDependencies)
### Description
FComponent is a small arhitecture framework for creating litte
simple blocks. It may be usefull for simple integration to you
MV* framework. For example backbone.

### API
#### `add(block, name)`  
register blocks  

- `block` - Object of custom block definition. 
            Block must have `add` and `destroy` methods,
            otherwise method `add` throws Error. You can also
            define `name` of block or pass it as second 
            param.  
Type: Object {add:function(){}, destroy: function(){}}  
- `name` - name of block  
Type: String  
Default: `block.name` 
Example:  
```javascript
var sblocks = require("simple-blocks")();
sblocks.add({
  init: function($el, message){
    $el.html("<p>" + message + "</p>");
  },
  destroy: function($el){
    $el.empty();
  }
}, "test");
```

#### `init($root, arguments...)`  
Initialize all register blocks in `$root` DOM element  
- `$root` - dom element where find blocks  
Type: jQuery DOM object  
- `arguments` - additional params for initialize block  
Example:

Define block in html
```html
<body>
<div 
  data-sblock="test" 
  data-test="Hello block" />
<div 
  data-sblock="test" 
  data-test="Hello block" />
</body>
```

Initialize all blocks in body
```javascript
var $ = require("jquery");
var sblocks = require("simple-blocks")();
sblocks.init($("body"));
```

Result html is:
```html
<body>
<div 
  data-sblock="test" 
  data-sblock-test
  data-test="Hello block">
  <p>Hello block</p>
</div>
<div 
  data-sblock="test" 
  data-sblock-test
  data-test="Hello block2">
  <p>Hello block2</p>
</div>
</body>
```

### `item(name, $el, options, arguments...)`  
Method to init not marked html element as block  
- `name` - name of using block  
- `$el` - DOM element  
- `options` - options for initialize block
- `arguments` - additional params for initialize block  
Example:  

```javascript
var $ = require("jquery");
var sblock = require("simple-blocks")();
var $el = $('<div>');
$("body").append($el);
sblock.item("test", $el, "Hello block 3");
```

html dom result:
```html
<body>
<div 
  data-sblock="test" 
  data-sblock-test
  data-test="Hello block">
  <p>Hello block</p>
</div>
<div 
  data-sblock="test" 
  data-sblock-test
  data-test="Hello block2">
  <p>Hello block2</p>
</div>
<div 
  data-sblock="test" 
  data-sblock-test>
  <p>Hello block3</p>
</div>
</body>
```

#### `destroy($root)`
Destroy all initialize blocks in `$root` DOM element
- `$root` - dom element where find blocks  
Type: jQuery DOM object  
Example:  
```javascript
var $ = require("jquery");
var sblocks = require("simple-blocks")();
sblocks.destroy($("body"));
```

#### `api(name, funcname, $el, args...)`  
Call custom api for block
- `name` - name of block  
- `funcname` - name of callable function  
- `$el` - element where find dom element for initialize blocks  
- `arguments` - additional params  
Example:
```javascript
sblocks.add({
  init: function($el, val){
    $el.text(val || 0)
  },
  destroy: function($el){
    $el.empty();
  },
  api: {
    val: function($el, val){
      $el.text(val || 0);
    }
  }
}, "test");
/* after initializing apply method `api.val` to `$el` */
$el.text() === "0"; //true
sblocks.api("test", "val", $el,  2);
$el.text() === "2"; //true
```  

html dom result:
```html
<body>
  <div 
  data-sblock="test" 
  data-test="Hello block"/>
  <div 
    data-sblock="test" 
    data-test="Hello block2"/>
  <div data-sblock="test"/>
</body>
```

### Example of Backbone integration
```javascript
View = Backbone.View.extend({
  render: function(){
    sblocks.init(this.$el);
  },
  remove: function(){
    sblocks.destroy(this.$el);
    Backbone.View.prototype.remove.call(this);
  }
});
```
### Changelog
- 0.0.2 - bug fixing
- 0.0.1 - public version
