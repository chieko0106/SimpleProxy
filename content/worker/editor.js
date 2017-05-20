"use strict";

var EXPORTED_SYMBOLS = ["Editor"];

var Cc = Components.classes, Ci = Components.interfaces, Cu = Components.utils;
var app = Components.classes["@mozilla.org/xre/app-info;1"].getService(Components.interfaces.nsIXULAppInfo).ID
Cu.import("chrome://simpleproxy/content/core.js");

var Editor = {
  open: function (storage) {
    if (!storage.file) return;

    var wm = Cc["@mozilla.org/appshell/window-mediator;1"].getService(Ci.nsIWindowMediator);
    var window = wm.getMostRecentWindow("");
    if (app == "{ec8030f7-c20a-464f-9b0e-13a3a9e97384}") {
      var ScratchpadManager = window.Scratchpad.ScratchpadManager;
    }
    else {
      var ScratchpadManager = window.ScratchpadManager;
    }

    ScratchpadManager.openScratchpad({
      "filename": storage.file,
      "text": storage.buffer,
      "saved": true
    }).addEventListener(
      "click",
      function (event) {
        if (event.target.id == "sp-toolbar-save") {
          Core.listData(storage);
        }
      },
      false
    );
  }
};
