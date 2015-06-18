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

"use strict";
var $, LIB_CONFIG, browser, dataFlag, eventName, getStorageData, hasOwnProp, hook, needFix, storage, _H;

LIB_CONFIG = {
  name: "Matcha",
  version: "0.5.1"
};

_H = {};

$ = jQuery;

storage = {

  /*
   * 模块
   *
   * @property   modules
   * @type       {Object}
   */
  modules: {},

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

browser = (function() {
  var detectBrowser, jQueryBrowser, ua;
  ua = window.navigator.userAgent.toLowerCase();
  jQueryBrowser = function() {
    var match, result;
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
    var match;
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
    browser.language = navigator.language || navigator.browserLanguage;
    return browser;
  };
  return detectBrowser();
})();


/*
 * 判断某个对象是否有自己的指定属性
 *
 * !!! 不能用 object.hasOwnProperty(prop) 这种方式，低版本 IE 不支持。
 *
 * @private
 * @method   hasOwnProp
 * @return   {Boolean}
 */

hasOwnProp = function(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
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
  return (no_dot === true ? "" : ".") + "js-" + getStorageData("hook." + name);
};


/*
 * 获取事件名称
 */

eventName = function(event_name) {
  return ("" + event_name + "." + LIB_CONFIG.name).toLowerCase();
};


/*
 * 获取 data 的标识
 */

dataFlag = function(flag) {
  return "" + LIB_CONFIG.name + "." + flag;
};


/*
 * Get data from internal storage
 *
 * @private
 * @method   getStorageData
 * @param    ns_str {String}   Namespace string
 * @return   {String}
 */

getStorageData = function(ns_str) {
  var parts, result;
  parts = ns_str.split(".");
  result = storage;
  $.each(parts, function(idx, part) {
    var rv;
    rv = hasOwnProp(result, part);
    result = result[part];
    return rv;
  });
  return result;
};


/*
 * Whether to need to fix IE
 *
 * @private
 * @method   needFix
 * @param    version {Integer}
 * @return   {Boolean}
 */

needFix = function(version) {
  return browser.msie && browser.version * 1 < version;
};

storage.modules.Component = (function() {
  var Component, savedComps;
  savedComps = storage.components;
  Component = (function() {
    function Component(name, func) {
      if (hasOwnProp(savedComps, name)) {
        throw "The component '" + name + "' exists.";
      } else if (hasOwnProp(_H, name)) {
        throw "Wrong component's name!!!";
      } else {
        _H[name] = savedComps[name] = func;
      }
    }

    return Component;

  })();
  return Component;
})();

_H.addComponent = function(name, func) {
  return new storage.modules.Component(name, func);
};

(function(_H) {
  return $(function() {
    return $("select.DropList").each(function() {
      var ddl, idx, lst, sel, selected;
      sel = $(this);
      selected = $(":selected", sel);
      idx = $("option", sel).index(selected);
      sel.attr("tabindex", -1).removeClass("DropList").addClass("DropList--dummy");
      ddl = $("<div>", {
        "class": "DropList"
      });
      ddl.append("<div class=\"DropList-selected\"><span class=\"DropList-label\">" + (selected.text()) + "</span></div>\n<div class=\"DropList-dropdown\"><ul class=\"DropList-list\"></ul></div>");
      lst = $(".DropList-list", ddl);
      $("option", sel).each(function() {
        return lst.append("<li class=\"" + (hook("dropdown.trigger", true)) + "\">" + ($(this).text()) + "</li>");
      });
      $("li:eq(" + idx + ")", lst).addClass("is-selected");
      sel.after(ddl);
      return ddl.data(dataFlag("DropListDummy"), sel);
    });
  });
})(_H);

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

(function(_H) {

  /*
   * Construct HTML string for score
   *
   * @private
   * @method   scoreHtml
   * @param    data {Object}
   * @return   {String}
   */
  var scoreHtml;
  scoreHtml = function(data) {
    var id, score;
    score = data.score;
    id = "" + data.name + "-" + score;
    return "<input id=\"" + id + "\" class=\"Score-storage Score-storage-" + score + "\" type=\"radio\" name=\"" + data.name + "\" value=\"" + score + "\">\n<a class=\"Score-level Score-level-" + score + "\" href=\"http://www.baidu.com/\">\n  <label for=\"" + id + "\">" + score + "</label>\n</a>";
  };
  return $(function() {
    $(".Score--selectable[data-highest]").each(function() {
      var data, highest, lowest, __e;
      __e = $(this);
      highest = Number(__e.data("highest"));
      lowest = 1;
      data = {};
      __e.width(highest * 16);
      data.name = __e.data("name") || ("Score-" + ($(".Score--selectable").index(__e) + 1));
      if (isNaN(highest)) {
        highest = 0;
      } else {
        highest += 1;
      }
      while (lowest < highest) {
        data.score = lowest++;
        __e.append(scoreHtml(data));
      }
      return true;
    });
    if (needFix(9)) {
      return $(".Score--selectable .Score-level").addClass(hook("score.trigger", true));
    }
  });
})(_H);

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

(function(_H) {
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
})(_H);

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

(function(_H) {
  var defaults;
  defaults = {
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
  return _H.addComponent("dataList", function(settings) {
    settings = $.extend(true, {}, defaults, settings);
    return settings;
  });
})(_H);

(function(_H) {
  var autoSlide, changeUnit, defaults, initSlides, nextUnit, slidesEffect, triggerHtml;
  defaults = {
    $el: null,
    vertical: false,
    dir: 1,
    effect: "fade",
    auto: false,
    interval: 5,
    pageable: false
  };
  initSlides = function($el, opts) {
    var effect, wrapper;
    effect = opts.effect;
    wrapper = $el.parent();
    $el.addClass("Slides").data(dataFlag("SlidesEffect"), effect).children("li").addClass("Slides-unit").eq(0).addClass("is-active");
    if (opts.pageable === true) {

    } else {

    }
    if (opts.auto === true) {
      autoSlide($el, ($.isNumeric(opts.interval) ? opts.interval : defaults.interval) * 1000, effect);
    } else {
      wrapper.append("<div class=\"Slides-triggers\">" + (triggerHtml("prev")) + (triggerHtml("next")) + "</div>");
    }
    return wrapper;
  };
  autoSlide = function(slides, interval, effect) {
    setTimeout(function() {
      return changeUnit(slides, 1, effect, function() {
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
  changeUnit = function(slides, dir, effect, callback) {
    var curr, currCls, next, nextCls;
    currCls = "is-active";
    nextCls = "is-next";
    curr = slides.children("li." + currCls);
    next = nextUnit(curr, slides, dir);
    next.addClass(nextCls);
    slidesEffect(curr, effect, function() {
      next.removeClass(nextCls).addClass(currCls);
      curr.removeClass(currCls).show();
      return typeof callback === "function" ? callback() : void 0;
    });
    return next;
  };
  nextUnit = function(unit, slides, dir) {
    var next;
    if (dir === 0) {
      if (unit.is(":first-child")) {
        next = slides.children("li:last-child");
      } else {
        next = unit.prev();
      }
    } else {
      if (unit.is(":last-child")) {
        next = slides.children("li:first-child");
      } else {
        next = unit.next();
      }
    }
    return next;
  };
  slidesEffect = function(unit, effect, handler) {
    if (effect === "fade") {
      unit.fadeOut(handler);
    } else if (effect === "slide") {

    } else {
      handler();
    }
  };
  _H.addComponent("slides", function($el, settings) {
    if (settings == null) {
      settings = {};
    }
    if ($.isPlainObject($el)) {
      settings = $el;
      $el = settings.$el;
    } else {
      settings.$el = $el;
    }
    return $el.wrap("<div class=\"Slides-wrapper\" />").each(function() {
      return initSlides($(this), $.extend(true, {}, defaults, settings));
    });
  });
  return $(document).on("click", ".Slides-trigger", function() {
    var slides;
    slides = $(this).closest(".Slides-wrapper").children(".Slides");
    changeUnit(slides, ($(this).attr("data-direction") === "prev" ? 0 : 1), slides.data(dataFlag("SlidesEffect")));
    return false;
  });
})(_H);

window[LIB_CONFIG.name] = _H;

}));
