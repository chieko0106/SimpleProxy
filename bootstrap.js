"use strict";

var Cc = Components.classes, Ci = Components.interfaces, Cu = Components.utils;
var app = Components.classes["@mozilla.org/xre/app-info;1"].getService(Components.interfaces.nsIXULAppInfo).ID

function startup(data, reason) {
  Cu.import("chrome://simpleproxy/content/events.js");
  Events.on();
  Cu.import("chrome://simpleproxy/content/proxy.js");
  Proxy.on();
  Cu.import("chrome://simpleproxy/content/config.js");
  Configuration.on();
  if (app == "{ec8030f7-c20a-464f-9b0e-13a3a9e97384}") {
    Cu.import("chrome://simpleproxy/content/toolbar.js");
    Toolbar.on();
  }
}

function shutdown(data, reason) {
  Events.off();
  Cu.unload("chrome://simpleproxy/content/events.js");
  Proxy.off();
  Cu.unload("chrome://simpleproxy/content/proxy.js");
  Configuration.off();
  Cu.unload("chrome://simpleproxy/content/config.js");
  if (app == "{ec8030f7-c20a-464f-9b0e-13a3a9e97384}") {
    Toolbar.off();
    Cu.unload("chrome://simpleproxy/content/toolbar.js");
  }

  Cu.unload("chrome://simpleproxy/content/core.js");
  Cu.unload("chrome://simpleproxy/content/worker.js");
  Cu.unload("chrome://simpleproxy/content/worker/pac.js");
  Cu.unload("chrome://simpleproxy/content/worker/editor.js");
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
