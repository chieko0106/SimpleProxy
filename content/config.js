"use strict";

var EXPORTED_SYMBOLS = ["Configuration"];

var Cc = Components.classes, Ci = Components.interfaces, Cu = Components.utils;
var obs = Cc["@mozilla.org/observer-service;1"].getService(Ci.nsIObserverService);
Cu.import("resource://simpleproxy/pref-utils.js");
Cu.import("chrome://simpleproxy/content/worker.js");

var Configuration = {
  observe: function (subject, topic, data) {
    var document = subject.QueryInterface(Ci.nsIDOMDocument);

    if (topic == "addon-options-displayed" && data == "simpleproxy@jc3213.github") {
      Configuration.enable(document);
    }
    else {
      Configuration.disable(document);
    }
  },
  enable: function (document) {
    document.getElementById("simpleproxy-pac").addEventListener("command", Worker["pac"]);
    var num = Preferences.getValue( { name: "number", type: "integer" } );
    for (var i = 0; i < 9; i ++) {
      document.getElementById("simpleproxy-reset." + i).addEventListener("command", Worker["reset"]);
      document.getElementById("simpleproxy-editor." + i).addEventListener("command", Worker["editor"]);
      if (i < num) {
        document.getElementById("simpleproxy-switch_" + i).removeAttribute("hidden");
        document.getElementById("simpleproxy-list_" + i).removeAttribute("disabled");
        document.getElementById("simpleproxy-protocol_" + i).removeAttribute("disabled");
        document.getElementById("simpleproxy-address_" + i).removeAttribute("disabled");
        document.getElementById("simpleproxy-port_" + i).removeAttribute("disabled");
        document.getElementById("simpleproxy-list." + i).removeAttribute("disabled");
        document.getElementById("simpleproxy-editor." + i).removeAttribute("disabled");
        document.getElementById("simpleproxy-reset." + i).removeAttribute("disabled");
      }
      else {
        document.getElementById("simpleproxy-switch_" + i).setAttribute("hidden", true);
        document.getElementById("simpleproxy-list_" + i).setAttribute("disabled", true);
        document.getElementById("simpleproxy-protocol_" + i).setAttribute("disabled", true);
        document.getElementById("simpleproxy-address_" + i).setAttribute("disabled", true);
        document.getElementById("simpleproxy-port_" + i).setAttribute("disabled", true);
        document.getElementById("simpleproxy-list." + i).setAttribute("disabled", true);
        document.getElementById("simpleproxy-editor." + i).setAttribute("disabled", true);
        document.getElementById("simpleproxy-reset." + i).setAttribute("disabled", true);
      }
    }
  },
  disable: function (document) {
    document.getElementById("simpleproxy-pac").removeEventListener("command", Worker["pac"]);
    for (var i = 0; i < 9; i ++) {
      document.getElementById("simpleproxy-clear." + i).removeEventListener("command", Worker["clear"]);
      document.getElementById("simpleproxy-editor." + i).removeEventListener("command", Worker["editor"]);
    }
  },
  on: function () {
    obs.addObserver(Configuration, "addon-options-displayed", false);
  },
  off: function () {
    obs.removeObserver(Configuration, "addon-options-displayed", false);
  }
};
