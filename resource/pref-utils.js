"use strict";

var EXPORTED_SYMBOLS = ["Preferences"];

var Cc = Components.classes, Ci = Components.interfaces;
var prefs = Cc["@mozilla.org/preferences-service;1"].getService(Ci.nsIPrefService).QueryInterface(Ci.nsIPrefBranch);

var Preferences = {
  prefs: prefs.getBranch("extensions.simpleproxy."),
  option: [],
  observe: function (subject, topic, data) {
    if (topic == "nsPref:changed") {
      Preferences.option.forEach(function (element, index, array) {
        element();
      });
    }
  },
  getValue: function (branch) {
    if (branch.type == "boolean") {
      return Preferences.prefs.getBoolPref(branch.name);
    }
    else if (branch.type == "integer") {
      return Preferences.prefs.getIntPref(branch.name);
    }
    else if (branch.type == "string") {
      return Preferences.prefs.getComplexValue(branch.name, Ci.nsISupportsString).data;
    }
  },
  setValue: function (branch, value) {
    if (branch.type == "boolean") {
      Preferences.prefs.setBoolPref(branch.name, value);
    }
    else if (branch.type == "integer") {
      Preferences.prefs.setIntPref(branch.name, value);
    }
    else if (branch.type == "string") {
      var character = Cc["@mozilla.org/supports-string;1"].createInstance(Ci.nsISupportsString);
      character.data = value;
      Preferences.prefs.setComplexValue(branch.name, Ci.nsISupportsString, character);
    }
  },
  on: function (data, branch) {
    Preferences.option.push(branch);
    Preferences.prefs.addObserver(data, Preferences, false);
  },
  off: function (data, branch) {
    Preferences.option = [];
    Preferences.prefs.removeObserver(data, Preferences);
  }
};
