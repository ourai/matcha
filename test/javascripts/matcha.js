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
var $, CustomComponent, DataList, DropdownList, LIB_CONFIG, Score, browser, dataFlag, eventName, getDatasetByAttrs, getDatasetByHTML, getStorageData, hasOwnProp, hook, initializer, isFalse, isTrue, needFix, nodeDataset, storage, _H,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

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

initializer = function(componentClass, callback) {
  return function($el, settings) {
    var inst;
    inst = new componentClass($el, settings);
    if (typeof callback === "function") {
      callback();
    }
    return inst;
  };
};

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

$(document).ready(function() {
  _H.score($(".Score--selectable[data-highest]"));
  _H.dropdown($("select.DropList"));
});

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

_H.addComponent("dropdown", initializer(DropdownList));

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

_H.addComponent("score", initializer(Score, function() {
  if (needFix(9)) {
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

_H.addComponent("dataList", initializer(DataList));

(function(_H) {
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
  _H.addComponent("slides", initializer(Slides));
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

window[LIB_CONFIG.name] = _H;

}));
