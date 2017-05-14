"use strict";

var EXPORTED_SYMBOLS = ["Worker"];

var Cu = Components.utils;
Cu.import("resource://simpleproxy/pref-utils.js");
Cu.import("resource://simpleproxy/storage.js");
Cu.import("chrome://simpleproxy/content/worker/pac.js");
Cu.import("chrome://simpleproxy/content/worker/editor.js");

var Worker = {
  reset: function (event) {
    var id = event.target.id;
    var i = id.split("."), i = i[1];
    Preferences.setValue( { name: "list." + i, type: "string" }, "");
    Preferences.setValue( { name: "server." + i, type: "string" }, "");
  },
  editor: function (event) {
    var id = event.target.id;
    var i = id.split("."), i = i[1];
    Editor.open(Storage[i]);
  },
  pac: function () {
    PAC.make();
  }
};
