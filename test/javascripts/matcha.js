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
var $, Component, LIB_CONFIG, browser, dataFlag, eventName, getDatasetByAttrs, getDatasetByHTML, getStorageData, hasOwnProp, hook, isFalse, isTrue, needFix, nodeDataset, storage, _H;

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

nodeDataset = function(dom) {
  var dataset;
  if (dom.dataset != null) {
    dataset = dom.dataset;
  } else if (dom.outerHTML != null) {
    dataset = getDatasetByHTML(dom.outerHTML);
  } else if ((dom.attributes != null) && $.isNumeric(dom.attributes.length)) {
    dataset = getDatasetByAttrs(dom.attributes);
  } else {
    dataset = {};
  }
  return dataset;
};

getDatasetByHTML = function(html) {
  var dataset, fragment;
  dataset = {};
  if ((fragment = html.match(/<[a-z]+[^>]*>/i)) != null) {
    $.each(fragment[0].match(/(data(-[a-z]+)+=[^\s>]*)/ig) || [], function(attr) {
      attr = attr.match(/data-(.*)="([^\s"]*)"/i);
      dataset[$.camelCase(attr[1])] = attr[2];
      return true;
    });
  }
  return dataset;
};

getDatasetByAttrs = function(attrs) {
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

isTrue = function(value) {
  return value === true || value === "true";
};

isFalse = function(value) {
  return value === false || value === "false";
};

Component = (function() {
  var attr2dataset, convert, getMergedOption, getRawOption, html2dataset;

  convert = function(value) {
    if (value === "true") {
      value = true;
    } else if (value === "false") {
      value = false;
    } else if ($.isNumeric(value)) {
      value = Number(value);
    }
    return value;
  };

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

  getRawOption = function() {};

  getMergedOption = function() {};

  function Component(el, opts) {
    this.el = el;
    this.$el = $(el);
    this.__defaults = {};
  }

  Component.prototype.dataset = function(el) {
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

  Component.prototype.getOptions = function() {};

  Component.prototype.getOption = function(optName) {};

  return Component;

})();

storage.modules.Component = (function() {
  var savedComps, __Component;
  savedComps = storage.components;
  __Component = (function() {
    function __Component(name, func) {
      if (hasOwnProp(savedComps, name)) {
        throw "The component '" + name + "' exists.";
      } else if (hasOwnProp(_H, name)) {
        throw "Wrong component's name!!!";
      } else {
        _H[name] = savedComps[name] = func;
      }
    }

    return __Component;

  })();
  return __Component;
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
  var defaults, initScore, scoreHtml;
  defaults = {
    $el: null,
    highest: 5
  };
  initScore = function($el, opts) {
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

  /*
   * Construct HTML string for score
   *
   * @private
   * @method   scoreHtml
   * @param    data {Object}
   * @return   {String}
   */
  scoreHtml = function(data) {
    var id, score;
    score = data.score;
    id = "" + data.name + "-" + score;
    return "<input id=\"" + id + "\" class=\"Score-storage Score-storage-" + score + "\" type=\"radio\" name=\"" + data.name + "\" value=\"" + score + "\">\n<a class=\"Score-level Score-level-" + score + "\" href=\"http://www.baidu.com/\">\n  <label for=\"" + id + "\">" + score + "</label>\n</a>";
  };
  _H.addComponent("score", function($el, settings) {
    if (settings == null) {
      settings = {};
    }
    if ($.isPlainObject($el)) {
      settings = $el;
      $el = settings.$el;
    } else {
      settings.$el = $el;
    }
    $el.each(function() {
      return initScore($(this), $.extend(true, {}, defaults, settings, nodeDataset(this)));
    });
    if (needFix(9)) {
      return $(".Score--selectable .Score-level").addClass(hook("score.trigger", true));
    }
  });
  return $(document).on("click", hook("score.trigger"), function() {
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
})(_H);

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
  var autoSlide, changeUnit, changeUnitTrigger, defaults, initSlides, nextUnit, pageNumHtml, slideToEffect, slidesEffect, triggerHtml;
  defaults = {
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
  initSlides = function($el, opts) {
    var cls, effect, wrapper;
    effect = opts.effect;
    cls = "is-active";
    $el.addClass("Slides").data(dataFlag("SlidesEffect"), effect).children("li").addClass("Slides-unit").eq(0).addClass(cls);
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
      return initSlides($(this), $.extend(true, {}, defaults, settings, nodeDataset(this)));
    });
  });
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
})(_H);

$(document).ready(function() {
  return _H.score($(".Score--selectable[data-highest]"));
});

window[LIB_CONFIG.name] = _H;

}));
