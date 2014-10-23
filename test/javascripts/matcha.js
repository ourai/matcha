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
var LIB_CONFIG, browser, dummySelect, eventName, getStorageData, hasOwnProp, hook, needFix, scoreHtml, scoreLevels, setDefaultTab, storage, _H;

LIB_CONFIG = {
  name: "Matcha",
  version: "0.3.1"
};

_H = {};

storage = {

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
  sel = ddl.data("" + LIB_CONFIG.name + ".DropListDummy");
  $(":selected", sel).attr("selected", false);
  $("option:eq(" + idx + ")", sel).attr("selected", true);
  return sel.trigger("change");
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

setDefaultTab = function() {
  $(".Tabs[data-setdefault!='false'] > .Tabs-triggers").each(function() {
    var group, selector;
    group = $(this);
    selector = ".Tabs-trigger";
    if ($("" + selector + ".is-selected", group).size() === 0) {
      return $("" + selector + ":first", group).trigger("click");
    }
  });
  return $(".Tabs-trigger.is-selected").trigger("click");
};

scoreLevels = function() {
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
};

dummySelect = function() {
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
    return ddl.data("" + LIB_CONFIG.name + ".DropListDummy", sel);
  });
};

$(function() {
  setDefaultTab();
  scoreLevels();
  return dummySelect();
});

window[LIB_CONFIG.name] = _H;

}));
