"use strict";

var Cc = Components.classes, Ci = Components.interfaces, Cu = Components.utils;
var app = Components.classes["@mozilla.org/xre/app-info;1"].getService(Components.interfaces.nsIXULAppInfo).ID
var loader;

function startup(data, reason) {
  Cu.import("chrome://simpleproxy/content/events.js");
  Cu.import("chrome://simpleproxy/content/proxy.js");
  Cu.import("chrome://simpleproxy/content/config.js");

  if (app == "{ec8030f7-c20a-464f-9b0e-13a3a9e97384}") {
    Cu.import("chrome://simpleproxy/content/toolbar.js");

    loader = {
      on: function () {
        Events.on();
        Proxy.on();
        Configuration.on();
        Toolbar.on();
      },
      off: function () {
        Events.off();
        Proxy.off();
        Configuration.off();
        Toolbar.off();
      }
    };
  }
  else {
    loader = {
      on: function () {
        Events.on();
        Proxy.on();
        Configuration.on();
      },
      off: function () {
        Events.off();
        Proxy.off();
        Configuration.off();
      }
    };
  }
  loader.on();
}

function shutdown(data, reason) {
  loader.off();

  Cu.unload("chrome://simpleproxy/content/config.js");
  Cu.unload("chrome://simpleproxy/content/core.js");
  Cu.unload("chrome://simpleproxy/content/events.js");
  Cu.unload("chrome://simpleproxy/content/proxy.js");
  Cu.unload("chrome://simpleproxy/content/worker.js");
  Cu.unload("chrome://simpleproxy/content/worker/pac.js");
  Cu.unload("chrome://simpleproxy/content/worker/editor.js");
  if (app == "{ec8030f7-c20a-464f-9b0e-13a3a9e97384}") {
    Cu.unload("chrome://simpleproxy/content/toolbar.js");
  }
  Cu.unload("resource://simpleproxy/file-io.js");
  Cu.unload("resource://simpleproxy/makepattern.js");
  Cu.unload("resource://simpleproxy/pref-tuils.js");
  Cu.unload("resource://simpleproxy/storage.js");
  Cu.unload("resource://simpleproxy/sync.js");
}

function install(data, reason) {
}

function uninstall(data, reason) {
}
