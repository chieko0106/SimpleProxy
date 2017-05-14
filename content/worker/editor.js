"use strict";

var EXPORTED_SYMBOLS = ["Editor"];

var Cc = Components.classes, Ci = Components.interfaces, Cu = Components.utils;
var wm = Cc["@mozilla.org/appshell/window-mediator;1"].getService(Ci.nsIWindowMediator);
Cu.import("chrome://simpleproxy/content/core.js");

var Editor = {
  open: function (storage) {
    if (!storage.file) return;
    var window = wm.getMostRecentWindow("navigator:browser");
    var ScratchpadManager = window.Scratchpad.ScratchpadManager;

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
