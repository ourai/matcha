(function( global, factory ) {

  if ( typeof module === "object" && typeof module.exports === "object" ) {
    module.exports = global.document ?
      factory(global, true) :
      function( w ) {
        if ( !w.document ) {
          throw new Error("Requires a window with a document");
        }
        return factory(w);
      };
  } else {
    factory(global);
  }

}(typeof window !== "undefined" ? window : this, function( window, noGlobal ) {

  (function() {
    "use strict";
    var Environment, LIB, META, attach, batch, defineProp, hasOwnProp, objectTypes, settings, storage, toString;
  
    META = {
      name: "Miso",
      version: "0.4.1"
    };
  
    toString = {}.toString;
  
    settings = {
      validator: function() {
        return true;
      }
    };
  
    storage = {
      types: {}
    };
  
  
    /*
     * Fill the map object-types, and add methods to detect object-type.
     * 
     * @private
     * @method   objectTypes
     * @return   {Object}
     */
  
    objectTypes = function() {
      var type, types, _fn, _i, _len;
      types = "Boolean Number String Function Array Date RegExp Object".split(" ");
      _fn = function(type) {
        var handler, lc;
        storage.types["[object " + type + "]"] = lc = type.toLowerCase();
        if (type === "Number") {
          handler = function(target) {
            if (isNaN(target)) {
              return false;
            } else {
              return this.type(target) === lc;
            }
          };
        } else {
          handler = function(target) {
            return this.type(target) === lc;
          };
        }
        return storage.methods["is" + type] = handler;
      };
      for (_i = 0, _len = types.length; _i < _len; _i++) {
        type = types[_i];
        _fn(type);
      }
      return storage.types;
    };
  
  
    /*
     * 判断某个对象是否有自己的指定属性
     *
     * !!! 不能用 object.hasOwnProperty(prop) 这种方式，低版本 IE 不支持。
     *
     * @private
     * @method   hasOwnProp
     * @param    obj {Object}    Target object
     * @param    prop {String}   Property to be tested
     * @return   {Boolean}
     */
  
    hasOwnProp = function(obj, prop) {
      if (obj == null) {
        return false;
      } else {
        return Object.prototype.hasOwnProperty.call(obj, prop);
      }
    };
  
  
    /*
     * 为指定 object 或 function 定义属性
     *
     * @private
     * @method   defineProp
     * @param    obj {Object}
     * @param    prop {String}
     * @param    value {Mixed}
     * @param    [writable] {Boolean}
     * @return   {Boolean}
     */
  
    defineProp = function(obj, prop, value, writable) {
      var error;
      if (writable == null) {
        writable = false;
      }
      try {
        Object.defineProperty(obj, prop, {
          __proto__: null,
          writable: writable,
          value: value
        });
      } catch (_error) {
        error = _error;
        obj[prop] = value;
      }
      return true;
    };
  
  
    /*
     * 批量添加 method
     *
     * @private
     * @method  batch
     * @param   handlers {Object}   data of a method
     * @param   data {Object}       data of a module
     * @param   host {Object}       the host of methods to be added
     * @return
     */
  
    batch = function(handlers, data, host) {
      var methods;
      methods = storage.methods;
      if (methods.isArray(data) || (methods.isPlainObject(data) && !methods.isArray(data.handlers))) {
        methods.each(data, function(d) {
          return batch(d != null ? d.handlers : void 0, d, host);
        });
      } else if (methods.isPlainObject(data) && methods.isArray(data.handlers)) {
        methods.each(handlers, function(info) {
          return attach(info, data, host);
        });
      }
      return host;
    };
  
  
    /*
     * 构造 method
     *
     * @private
     * @method  attach
     * @param   set {Object}        data of a method
     * @param   data {Object}       data of a module
     * @param   host {Object}       the host of methods to be added
     * @return
     */
  
    attach = function(set, data, host) {
      var handler, method, methods, name, validator, validators, value, _i, _len;
      name = set.name;
      methods = storage.methods;
      if (set.expose !== false && !methods.isFunction(host[name])) {
        handler = set.handler;
        value = hasOwnProp(set, "value") ? set.value : data.value;
        validators = [
          set.validator, data.validator, settings.validator, function() {
            return true;
          }
        ];
        for (_i = 0, _len = validators.length; _i < _len; _i++) {
          validator = validators[_i];
          if (methods.isFunction(validator)) {
            break;
          }
        }
        method = function() {
          if (methods.isFunction(handler) && validator.apply(host, arguments) === true) {
            return handler.apply(host, arguments);
          } else {
            return value;
          }
        };
        host[name] = method;
      }
      return host;
    };
  
    storage.methods = {
  
      /*
       * 扩充对象
       * 
       * @method   extend
       * @param    data {Plain Object/Array}
       * @param    [host] {Object}
       * @return   {Object}
       */
      extend: function(data, host) {
        return this(data, host != null ? host : this);
      },
  
      /*
       * 扩展指定对象
       * 
       * @method  mixin
       * @param   unspecified {Mixed}
       * @return  {Object}
       */
      mixin: function() {
        var args, clone, copy, copyIsArray, deep, i, length, name, opts, src, target;
        args = arguments;
        length = args.length;
        target = args[0] || {};
        i = 1;
        deep = false;
        if (this.type(target) === "boolean") {
          deep = target;
          target = args[1] || {};
          i = 2;
        }
        if (typeof target !== "object" && !this.isFunction(target)) {
          target = {};
        }
        if (length === 1) {
          target = this;
          i--;
        }
        while (i < length) {
          opts = args[i];
          if (opts != null) {
            for (name in opts) {
              copy = opts[name];
              src = target[name];
              if (copy === target) {
                continue;
              }
              if (deep && copy && (this.isPlainObject(copy) || (copyIsArray = this.isArray(copy)))) {
                if (copyIsArray) {
                  copyIsArray = false;
                  clone = src && this.isArray(src) ? src : [];
                } else {
                  clone = src && this.isPlainObject(src) ? src : {};
                }
                target[name] = this.mixin(deep, clone, copy);
              } else if (copy !== void 0) {
                target[name] = copy;
              }
            }
          }
          i++;
        }
        return target;
      },
  
      /*
       * 遍历
       * 
       * @method  each
       * @param   object {Object/Array/Array-Like/Function/String}
       * @param   callback {Function}
       * @return  {Mixed}
       */
      each: function(object, callback) {
        var ele, index, name, value;
        if (this.isArray(object) || this.isArrayLike(object) || this.isString(object)) {
          index = 0;
          while (index < object.length) {
            ele = this.isString(object) ? object.charAt(index) : object[index];
            if (callback.apply(ele, [ele, index++, object]) === false) {
              break;
            }
          }
        } else if (this.isObject(object) || this.isFunction(object)) {
          for (name in object) {
            value = object[name];
            if (callback.apply(value, [value, name, object]) === false) {
              break;
            }
          }
        }
        return object;
      },
  
      /*
       * 获取对象类型
       * 
       * @method  type
       * @param   object {Mixed}
       * @return  {String}
       */
      type: function(object) {
        var result;
        if (arguments.length === 0) {
          result = null;
        } else {
          result = object == null ? String(object) : storage.types[toString.call(object)] || "object";
        }
        return result;
      },
  
      /*
       * 切割 Array-Like Object 片段
       *
       * @method   slice
       * @param    target {Array-Like}
       * @param    begin {Integer}
       * @param    end {Integer}
       * @return
       */
      slice: function(target, begin, end) {
        var args, result;
        if (target == null) {
          result = [];
        } else {
          end = Number(end);
          args = [Number(begin) || 0];
          if (arguments.length > 2 && !isNaN(end)) {
            args.push(end);
          }
          result = [].slice.apply(target, args);
        }
        return result;
      },
  
      /*
       * 判断某个对象是否有自己的指定属性
       *
       * @method   hasProp
       * @param    prop {String}   Property to be tested
       * @param    obj {Object}    Target object
       * @return   {Boolean}
       */
      hasProp: function(prop, obj) {
        return hasOwnProp.apply(this, [(arguments.length < 2 ? this : obj), prop]);
      },
  
      /*
       * Returns the namespace specified and creates it if it doesn't exist.
       * Be careful when naming packages.
       * Reserved words may work in some browsers and not others.
       *
       * @method  namespace
       * @param   [host] {Object}      Host object namespace will be added to
       * @param   [ns_str_1] {String}     The first namespace string
       * @param   [ns_str_2] {String}     The second namespace string
       * @param   [ns_str_*] {String}     Numerous namespace string
       * @param   [isGlobal] {Boolean}    Whether set window as the host object
       * @return  {Object}                A reference to the last namespace object created
       */
      namespace: function(host) {
        var args, ns;
        args = arguments;
        ns = {};
        if (!this.isPlainObject(host)) {
          host = args[args.length - 1] === true ? window : this;
        }
        this.each(args, (function(_this) {
          return function(arg) {
            var obj;
            if (_this.isString(arg) && /^[0-9A-Z_.]+[^_.]?$/i.test(arg)) {
              obj = host;
              _this.each(arg.split("."), function(part, idx, parts) {
                if (obj == null) {
                  return false;
                }
                if (!_this.hasProp(part, obj)) {
                  obj[part] = idx === parts.length - 1 ? null : {};
                }
                obj = obj[part];
                return true;
              });
              ns = obj;
            }
            return true;
          };
        })(this));
        return ns;
      },
  
      /*
       * 判断是否为 window 对象
       * 
       * @method  isWindow
       * @param   object {Mixed}
       * @return  {Boolean}
       */
      isWindow: function(object) {
        return object && this.isObject(object) && "setInterval" in object;
      },
  
      /*
       * 判断是否为 DOM 对象
       * 
       * @method  isElement
       * @param   object {Mixed}
       * @return  {Boolean}
       */
      isElement: function(object) {
        return object && this.isObject(object) && object.nodeType === 1;
      },
  
      /*
       * 判断是否为数字类型（字符串）
       * 
       * @method  isNumeric
       * @param   object {Mixed}
       * @return  {Boolean}
       */
      isNumeric: function(object) {
        return !this.isArray(object) && !isNaN(parseFloat(object)) && isFinite(object);
      },
  
      /*
       * Determine whether a number is an integer.
       *
       * @method  isInteger
       * @param   object {Mixed}
       * @return  {Boolean}
       */
      isInteger: function(object) {
        return this.isNumeric(object) && /^-?[1-9]\d*$/.test(object);
      },
  
      /*
       * 判断对象是否为纯粹的对象（由 {} 或 new Object 创建）
       * 
       * @method  isPlainObject
       * @param   object {Mixed}
       * @return  {Boolean}
       */
      isPlainObject: function(object) {
        var error, key;
        if (!object || !this.isObject(object) || object.nodeType || this.isWindow(object)) {
          return false;
        }
        try {
          if (object.constructor && !this.hasProp("constructor", object) && !this.hasProp("isPrototypeOf", object.constructor.prototype)) {
            return false;
          }
        } catch (_error) {
          error = _error;
          return false;
        }
        for (key in object) {
          key;
        }
        return key === void 0 || this.hasProp(key, object);
      },
  
      /*
       * Determin whether a variable is considered to be empty.
       *
       * A variable is considered empty if its value is or like:
       *  - null
       *  - undefined
       *  - ""
       *  - []
       *  - {}
       *
       * @method  isEmpty
       * @param   object {Mixed}
       * @return  {Boolean}
       *
       * refer: http://www.php.net/manual/en/function.empty.php
       */
      isEmpty: function(object) {
        var name, result;
        result = false;
        if ((object == null) || object === "") {
          result = true;
        } else if ((this.isArray(object) || this.isArrayLike(object)) && object.length === 0) {
          result = true;
        } else if (this.isObject(object)) {
          result = true;
          for (name in object) {
            result = false;
            break;
          }
        }
        return result;
      },
  
      /*
       * 是否为类数组对象
       *
       * 类数组对象（Array-Like Object）是指具备以下特征的对象：
       * -
       * 1. 不是数组（Array）
       * 2. 有自动增长的 length 属性
       * 3. 以从 0 开始的数字做属性名
       *
       * @method  isArrayLike
       * @param   object {Mixed}
       * @return  {Boolean}
       */
      isArrayLike: function(object) {
        var length, result;
        result = false;
        if (this.isObject(object) && !this.isWindow(object)) {
          length = object.length;
          if (object.nodeType === 1 && length || !this.isArray(object) && !this.isFunction(object) && (length === 0 || this.isNumber(length) && length > 0 && (length - 1) in object)) {
            result = true;
          }
        }
        return result;
      },
  
      /*
       * 更改 META.name
       * 
       * @method   mask
       * @param    guise {String}    New name for library
       * @return   {Boolean}
       */
      mask: function(guise) {
        var error, lib_name, result;
        if (this.isString(guise)) {
          if (this.hasProp(guise, window)) {
            if (window.console) {
              console.error("'" + guise + "' has existed as a property of Window object.");
            }
          } else {
            lib_name = this.__meta__.name;
            window[guise] = window[lib_name];
            try {
              result = delete window[lib_name];
            } catch (_error) {
              error = _error;
              window[lib_name] = void 0;
              result = true;
            }
            this.__meta__.name = guise;
          }
        } else {
          result = false;
        }
        return result;
      },
  
      /*
       * 别名
       * 
       * @method  alias
       * @param   name {String}
       * @return
       */
      alias: function(name) {
        if (this.isString(name) && window[name] === void 0) {
          window[name] = this;
        }
        return window[String(name)];
      }
    };
  
    Environment = (function() {
      var detectBrowser, detectPlatform, jQueryBrowser, nav, platformName, platformVersion, suffix, ua;
  
      nav = navigator;
  
      ua = nav.userAgent.toLowerCase();
  
      suffix = {
        windows: {
          "5.1": "XP",
          "5.2": "XP x64 Edition",
          "6.0": "Vista",
          "6.1": "7",
          "6.2": "8",
          "6.3": "8.1"
        }
      };
  
      platformName = function() {
        var name;
        name = /^[\w.\/]+ \(([^;]+?)[;)]/.exec(ua)[1].split(" ").shift();
        if (name === "compatible") {
          return "windows";
        } else {
          return name;
        }
      };
  
      platformVersion = function() {
        var _ref;
        return (_ref = (/windows nt ([\w.]+)/.exec(ua) || /os ([\w]+) like mac/.exec(ua) || /mac os(?: [a-z]*)? ([\w.]+)/.exec(ua) || [])[1]) != null ? _ref.replace(/_/g, ".") : void 0;
      };
  
      detectPlatform = function() {
        var platform;
        platform = {
          touchable: false,
          version: platformVersion()
        };
        platform[platformName()] = true;
        if (platform.windows) {
          platform.version = suffix.windows[platform.version];
          platform.touchable = /trident[ \/][\w.]+; touch/.test(ua);
        } else if (platform.ipod || platform.iphone || platform.ipad) {
          platform.touchable = platform.ios = true;
        }
        return platform;
      };
  
      jQueryBrowser = function() {
        var browser, match, result;
        browser = {};
        match = /(chrome)[ \/]([\w.]+)/.exec(ua) || /(webkit)[ \/]([\w.]+)/.exec(ua) || /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua) || /(msie) ([\w.]+)/.exec(ua) || ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) || [];
        result = {
          browser: match[1] || "",
          version: match[2] || "0"
        };
        if (result.browser) {
          browser[result.browser] = true;
          browser.version = result.version;
        }
        if (browser.chrome) {
          browser.webkit = true;
        } else if (browser.webkit) {
          browser.safari = true;
        }
        return browser;
      };
  
      detectBrowser = function() {
        var browser, match;
        match = /trident.*? rv:([\w.]+)/.exec(ua);
        if (match) {
          browser = {
            msie: true,
            version: match[1]
          };
        } else {
          browser = jQueryBrowser();
          if (browser.mozilla) {
            browser.firefox = true;
            match = /firefox[ \/]([\w.]+)/.exec(ua);
            if (match) {
              browser.version = match[1];
            }
          }
        }
        browser.language = nav.language || nav.browserLanguage;
        return browser;
      };
  
      function Environment() {
        this.platform = detectPlatform();
        this.browser = detectBrowser();
      }
  
      return Environment;
  
    })();
  
    objectTypes();
  
    LIB = function(data, host) {
      return batch(data != null ? data.handlers : void 0, data, host != null ? host : {});
    };
  
    storage.methods.each(storage.methods, function(handler, name) {
      LIB[name] = handler;
    });
  
    LIB.mixin(new Environment);
  
    defineProp(LIB, "__meta__", META, true);
  
    window[META.name] = LIB;
  
  }).call(this);
  
  (function() {
    "use strict";
    var $, CustomComponent, DataList, DropdownList, LIB, META, Score, createComponent, dataFlag, defineProp, eventName, hook, isTrue, storage,
      __hasProp = {}.hasOwnProperty,
      __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };
  
    LIB = Miso;
  
    META = {
      name: "Matcha",
      version: "0.5.1"
    };
  
    $ = jQuery;
  
    storage = {
  
      /*
       * 已注册组件
       *
       * @property   components
       * @type       {Object}
       */
      components: {},
  
      /*
       * JavaScript 钩子
       *
       * @property   hook
       * @type       {Object}
       */
      hook: {
        tabs: {
          component: "tabs",
          trigger: "trigger--tab",
          content: "tabs-content"
        },
        score: {
          trigger: "trigger--score"
        },
        dropdown: {
          trigger: "trigger--dropdown"
        },
        uploader: {
          trigger: "trigger--uploader",
          label: "label--uploader"
        }
      }
    };
  
  
    /*
     * 获取指定钩子
     *
     * @private
     * @method   hook
     * @param    name {String}     Hook's name
     * @param    no_dot {Boolean}  Return class when true, default is selector
     * @return   {String}
     */
  
    hook = function(name, no_dot) {
      return (no_dot === true ? "" : ".") + "js-" + LIB.namespace(storage, "hook." + name);
    };
  
  
    /*
     * 获取事件名称
     */
  
    eventName = function(event_name) {
      return ("" + event_name + "." + META.name).toLowerCase();
    };
  
  
    /*
     * 获取 data 的标识
     */
  
    dataFlag = function(flag) {
      return "" + META.name + "." + flag;
    };
  
    isTrue = function(value) {
      return value === true || value === "true";
    };
  
    createComponent = function(componentClass, callback) {
      return function($el, settings) {
        var inst;
        inst = new componentClass($el, settings);
        if (typeof callback === "function") {
          callback();
        }
        return inst;
      };
    };
  
    CustomComponent = (function() {
      var attr2dataset, html2dataset;
  
      html2dataset = function(html) {
        var dataset, _ref;
        dataset = {};
        $.each(((_ref = html.match(/<[a-z]+[^>]*>/i)) != null ? _ref[0].match(/(data(-[a-z]+)+=[^\s>]*)/ig) : void 0) || [], function(attr) {
          attr = attr.match(/data-(.*)="([^\s"]*)"/i);
          dataset[$.camelCase(attr[1])] = attr[2];
          return true;
        });
        return dataset;
      };
  
      attr2dataset = function(attrs) {
        var dataset;
        dataset = {};
        $.each(attrs, function(attr) {
          var match;
          if (attr.nodeType === 2 && ((match = attr.nodeName.match(/^data-(.*)$/i)) != null)) {
            dataset[$.camelCase(match(1))] = attr.nodeValue;
          }
          return true;
        });
        return dataset;
      };
  
      function CustomComponent($el, opts) {
        var _ref;
        if ($el == null) {
          $el = $();
        }
        if (opts == null) {
          opts = {};
        }
        if ($.isPlainObject($el)) {
          opts = $el;
          $el = (_ref = opts.$el) != null ? _ref : $();
        } else {
          opts.$el = $el;
        }
        $el.each((function(_this) {
          return function(idx, el) {
            var _ref1;
            _this.initialize($(el), $.extend(true, {}, (_ref1 = _this.defaults) != null ? _ref1 : {}, opts, _this.dataset(el)), opts);
          };
        })(this));
      }
  
      CustomComponent.prototype.defaults = null;
  
      CustomComponent.prototype.wrapper = null;
  
      CustomComponent.prototype.initialize = function($el, mergedOpts, rawOpts) {};
  
      CustomComponent.prototype.dataset = function(el) {
        var dataset;
        if (el == null) {
          el = this.el;
        }
        if (el.dataset != null) {
          dataset = el.dataset;
        } else if (el.outerHTML != null) {
          dataset = html2dataset(el.outerHTML);
        } else if ((el.attributes != null) && $.isNumeric(el.attributes.length)) {
          dataset = attr2dataset(el.attributes);
        } else {
          dataset = {};
        }
        return dataset;
      };
  
      return CustomComponent;
  
    })();
  
    LIB.extend({
      handlers: [
        {
  
          /*
           * 添加 UI 组件
           *
           * @method   addComponent
           * @param    name {String}
           * @param    func {Function}
           * @return   {Function/Boolean}
           */
          name: "addComponent",
          handler: function(name, func) {
            if (this.hasProp(storage.components, name)) {
              throw "The component '" + name + "' exists.";
            } else if (this.hasProp(name)) {
              throw "Wrong component's name!!!";
            } else {
              LIB[name] = storage.components[name] = func;
            }
            return func;
          },
          validator: function(name, func) {
            return this.isString(name) && this.isFunction(func);
          },
          value: false
        }
      ]
    });
  
    DropdownList = (function(_super) {
      __extends(DropdownList, _super);
  
      function DropdownList() {
        return DropdownList.__super__.constructor.apply(this, arguments);
      }
  
      DropdownList.prototype.initialize = function($el, opts) {
        var ddl, idx, lst, selected;
        selected = $(":selected", $el);
        idx = $("option", $el).index(selected);
        $el.attr("tabindex", -1).removeClass("DropList").addClass("DropList--dummy");
        ddl = $("<div>", {
          "class": "DropList"
        });
        ddl.append("<div class=\"DropList-selected\"><span class=\"DropList-label\">" + (selected.text()) + "</span></div>\n<div class=\"DropList-dropdown\"><ul class=\"DropList-list\"></ul></div>");
        lst = $(".DropList-list", ddl);
        $("option", $el).each(function() {
          return lst.append("<li class=\"" + (hook("dropdown.trigger", true)) + "\">" + ($(this).text()) + "</li>");
        });
        $("li:eq(" + idx + ")", lst).addClass("is-selected");
        $el.after(ddl);
        return ddl.data(dataFlag("DropListDummy"), $el);
      };
  
      return DropdownList;
  
    })(CustomComponent);
  
    LIB.addComponent("dropdown", createComponent(DropdownList));
  
    $(document).on("click", hook("dropdown.trigger"), function() {
      var cls, ddl, idx, lst, sel, t;
      t = $(this);
      ddl = t.closest(".DropList");
      lst = t.closest(".DropList-list");
      idx = $("li", lst).index(t);
      cls = "is-selected";
      $("." + cls, lst).removeClass(cls);
      t.addClass(cls);
      $(".DropList-label", ddl).text(t.text());
      sel = ddl.data(dataFlag("DropListDummy"));
      $(":selected", sel).attr("selected", false);
      $("option:eq(" + idx + ")", sel).attr("selected", true);
      return sel.trigger("change");
    });
  
    Score = (function(_super) {
  
      /*
       * Construct HTML string for score
       *
       * @private
       * @method   scoreHtml
       * @param    data {Object}
       * @return   {String}
       */
      var scoreHtml;
  
      __extends(Score, _super);
  
      function Score() {
        return Score.__super__.constructor.apply(this, arguments);
      }
  
      scoreHtml = function(data) {
        var id, score;
        score = data.score;
        id = "" + data.name + "-" + score;
        return "<input id=\"" + id + "\" class=\"Score-storage Score-storage-" + score + "\" type=\"radio\" name=\"" + data.name + "\" value=\"" + score + "\">\n<a class=\"Score-level Score-level-" + score + "\" href=\"javascript:void(0);\"><label for=\"" + id + "\">" + score + "</label></a>";
      };
  
      Score.prototype.defaults = {
        highest: 5
      };
  
      Score.prototype.initialize = function($el, opts) {
        var data, highest, lowest;
        highest = Number(opts.highest);
        lowest = 1;
        data = {};
        $el.width(highest * 16);
        data.name = opts.name || ("Score-" + ($(".Score--selectable").index($el) + 1));
        if (isNaN(highest)) {
          highest = 0;
        } else {
          highest++;
        }
        while (lowest < highest) {
          data.score = lowest++;
          $el.append(scoreHtml(data));
        }
      };
  
      return Score;
  
    })(CustomComponent);
  
    LIB.addComponent("score", createComponent(Score, function() {
      if (LIB.browser.msie && LIB.browser.version * 1 < 9) {
        return $(".Score--selectable .Score-level").addClass(hook("score.trigger", true));
      }
    }));
  
    $(document).on("click", hook("score.trigger"), function() {
      var cls, t;
      t = $(this);
      cls = "is-selected";
      t.siblings("." + cls).removeClass(cls);
      t.addClass(cls);
      t.siblings("[checked]").attr("checked", false);
      t.prev(":radio").attr("checked", true);
      t.triggerHandler(eventName("select"));
      return false;
    });
  
    (function(LIB) {
      return $(function() {
        $(".Tabs[data-setdefault!='false'] > .Tabs-triggers").each(function() {
          var group, selector;
          group = $(this);
          selector = ".Tabs-trigger";
          if ($("" + selector + ".is-selected", group).size() === 0) {
            return $("" + selector + ":first", group).trigger("click");
          }
        });
        return $(".Tabs-trigger.is-selected").trigger("click");
      });
    })(LIB);
  
    $(document).on("click", hook("tabs.trigger"), function() {
      var tabs, trigger, type;
      trigger = $(this);
      tabs = trigger.closest(".Tabs");
      type = trigger.data("flag");
      $(".Tabs-trigger.is-selected, .Tabs-content.is-selected", tabs).removeClass("is-selected");
      $(".Tabs-content[data-flag='" + type + "']", tabs).add(trigger).addClass("is-selected");
      trigger.triggerHandler(eventName("change"), [type]);
      return false;
    });
  
    $(document).on("change", hook("uploader.trigger"), function() {
      var files, ipt, label, text, val;
      ipt = $(this);
      label = $(hook("uploader.label"), ipt.closest(".Uploader"));
      files = this.files;
      text = "No files selected";
      val = ipt.val();
      if (files != null) {
        label.text(files.length ? files[0].name : text);
      } else {
        label.text(val === "" ? text : val);
      }
      return false;
    });
  
    DataList = (function(_super) {
      __extends(DataList, _super);
  
      function DataList() {
        return DataList.__super__.constructor.apply(this, arguments);
      }
  
      DataList.prototype.defaults = {
        source: [],
        data: "{%ROOT%}",
        template: function(itemData) {},
        paginator: {
          tiny: false,
          container: null,
          total: 0,
          defaultPage: 0
        },
        update: function() {}
      };
  
      return DataList;
  
    })(CustomComponent);
  
    LIB.addComponent("dataList", createComponent(DataList));
  
    (function(LIB) {
      var Slides, autoSlide, changeUnit, changeUnitTrigger, nextUnit, pageNumHtml, slideToEffect, slidesEffect, triggerHtml;
      Slides = (function(_super) {
        __extends(Slides, _super);
  
        function Slides() {
          return Slides.__super__.constructor.apply(this, arguments);
        }
  
        Slides.prototype.defaults = {
          $el: null,
          vertical: false,
          dir: 1,
          effect: "fade",
          auto: false,
          interval: 5,
          pageable: false,
          locale: {
            prev: "Prev",
            next: "Next"
          }
        };
  
        Slides.prototype.initialize = function($el, opts) {
          var cls, effect, wrapper;
          effect = opts.effect;
          cls = "is-active";
          $el.wrap("<div class=\"Slides-wrapper\" />").addClass("Slides").data(dataFlag("SlidesEffect"), effect).children("li").addClass("Slides-unit").eq(0).addClass(cls);
          wrapper = $el.parent();
          if (isTrue(opts.pageable)) {
            $("<div class=\"Slides-pagination\"><ol>" + (pageNumHtml($el.children("li"))) + "</ol></div>").find("li:first").addClass(cls).closest(".Slides-pagination").appendTo(wrapper);
          }
          if (isTrue(opts.auto)) {
            autoSlide($el, ($.isNumeric(opts.interval) ? opts.interval : defaults.interval) * 1000, effect);
          } else {
            wrapper.append("<div class=\"Slides-triggers\">" + (triggerHtml("prev", opts.locale.prev)) + (triggerHtml("next", opts.locale.next)) + "</div>");
          }
          return wrapper;
        };
  
        return Slides;
  
      })(CustomComponent);
      pageNumHtml = function(units) {
        var html;
        html = [];
        units.each(function(idx) {
          var pageNum;
          pageNum = idx + 1;
          $(this).data(dataFlag("SlidesPageNum"), pageNum);
          return html.push("<li><a href=\"#\" data-page=\"" + pageNum + "\">" + pageNum + "</a></li>");
        });
        return html.join("");
      };
      autoSlide = function(slides, interval, effect) {
        setTimeout(function() {
          return changeUnit(slides.children("li.is-active"), nextUnit(slides, 1), 1, effect, function() {
            return autoSlide(slides, interval, effect);
          });
        }, interval);
      };
      triggerHtml = function(dir, text) {
        if (text == null) {
          text = "";
        }
        return "<button type=\"button\" class=\"Slides-trigger\" data-direction=\"" + dir + "\">" + text + "</button>";
      };
      changeUnit = function(curr, next, dir, effect, callback) {
        var nextCls;
        nextCls = "is-next";
        next.addClass(nextCls);
        slidesEffect(curr, dir, effect, function() {
          var currCls, pagination;
          currCls = "is-active";
          next.removeClass(nextCls).addClass(currCls);
          curr.removeClass(currCls).show();
          pagination = curr.closest(".Slides-wrapper").children(".Slides-pagination");
          if (pagination.size()) {
            $("[data-page='" + (next.data(dataFlag("SlidesPageNum"))) + "']", pagination).parent().addClass(currCls).siblings("." + currCls).removeClass(currCls);
          }
          return typeof callback === "function" ? callback() : void 0;
        });
        return next;
      };
      nextUnit = function(slides, dir, index) {
        var curr, next;
        if (index == null) {
          index = -1;
        }
        if (index === -1) {
          curr = slides.children("li.is-active");
          if (dir === 0) {
            if (curr.is(":first-child")) {
              next = slides.children("li:last-child");
            } else {
              next = curr.prev();
            }
          } else {
            if (curr.is(":last-child")) {
              next = slides.children("li:first-child");
            } else {
              next = curr.next();
            }
          }
        } else {
          next = slides.children("li:eq(" + index + ")");
        }
        return next;
      };
      slidesEffect = function(unit, dir, effect, handler) {
        if (effect === "fade") {
          unit.fadeOut(handler);
        } else if (effect === "slide") {
          slideToEffect(unit, dir, handler);
        } else {
          handler();
        }
      };
      slideToEffect = function(unit, dir, handler) {
        var prop, props, value;
        if (dir === 0) {
          prop = "right";
        } else {
          prop = "left";
        }
        value = unit.css(prop);
        props = {};
        props["" + prop] = "-" + (unit.outerWidth(true));
        return unit.animate(props, function() {
          unit.css(prop, value);
          return handler();
        });
      };
      changeUnitTrigger = function(el, getDirection, index) {
        var curr, dir, slides;
        slides = $(el).closest(".Slides-wrapper").children(".Slides");
        curr = slides.children("li.is-active");
        dir = getDirection.call(curr);
        return changeUnit(curr, nextUnit(slides, dir, index), dir, slides.data(dataFlag("SlidesEffect")));
      };
      LIB.addComponent("slides", createComponent(Slides));
      $(document).on("click", ".Slides-trigger", function() {
        changeUnitTrigger(this, (function(_this) {
          return function() {
            if ($(_this).attr("data-direction") === "prev") {
              return 0;
            } else {
              return 1;
            }
          };
        })(this));
        return false;
      });
      return $(document).on("click", ".Slides-pagination a", function() {
        var nextPage, pageNum;
        nextPage = $(this).parent();
        if (!nextPage.is(".is-active")) {
          pageNum = Number($("a", nextPage).attr("data-page"));
          changeUnitTrigger(this, function() {
            if (pageNum > Number($("a", nextPage.siblings(".is-active")).attr("data-page"))) {
              return 1;
            } else {
              return 0;
            }
          }, pageNum - 1);
        }
        return false;
      });
    })(LIB);
  
    LIB.mask(META.name);
  
    defineProp = function(key, value) {
      var e, prop;
      prop = {};
      prop[key] = value;
      if (LIB[key] != null) {
        LIB.mixin(prop);
      } else {
        try {
          Object.defineProperty(LIB, key, {
            __proto__: null,
            writable: true,
            value: value
          });
        } catch (_error) {
          e = _error;
          LIB.mixin(prop);
        }
      }
      return value;
    };
  
    defineProp("__class__", {
      Component: CustomComponent
    });
  
    defineProp("__meta__", META);
  
  }).call(this);
  
}));
