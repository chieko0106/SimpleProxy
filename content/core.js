"use strict";

var EXPORTED_SYMBOLS = ["Core"];

var Cc = Components.classes, Ci = Components.interfaces, Cu = Components.utils;
var wm = Cc["@mozilla.org/appshell/window-mediator;1"].getService(Ci.nsIWindowMediator);
Cu.import("resource://simpleproxy/storage.js");
Cu.import("resource://simpleproxy/sync.js");
Cu.import("resource://simpleproxy/file-io.js");
Cu.import("resource://simpleproxy/makepattern.js");

var Core = {
  subscription: function (storage) {
    if (storage.fetch || storage.date + 4 * 86400000 < Date.now()) {
      Synchronize.fetch(storage, Core.listData);
    }
    else {
      Core.listData(storage);
    }
  },
  listData: function (storage) {
    FileIO.loadFromFile(storage, Core.listArray);
  },
  listArray: function (storage) {
    storage.white = [], storage.match = [];

    try {
      var window = wm.getMostRecentWindow("navigator:browser");
      var list = window.atob(storage.buffer).split(/[\r\n]+/);
    }
    catch (e) {
      var list = storage.buffer.split(/[\r\n]+/);
    }

    list.forEach(function (element, index, array) {
      if (element.startsWith("!") || element.startsWith("[") || element == "") return;
      if (element.startsWith("@@")) {
        var pattern = Pattern.encode(element.substr(2));
        storage.white.push(pattern);
        Storage[999].push(pattern);
      }
      else {
        var pattern = Pattern.encode(element);
        storage.match.push(pattern);
      }
    });
  }
};
