"use strict";

var EXPORTED_SYMBOLS = ["Toolbar"];

var Cc = Components.classes, Ci = Components.interfaces, Cu = Components.utils;
var window = Cc["@mozilla.org/appshell/window-mediator;1"].getService(Ci.nsIWindowMediator).getMostRecentWindow("");
var strings = Cc["@mozilla.org/intl/stringbundle;1"].getService(Ci.nsIStringBundleService);
var stringBundle = strings.createBundle('chrome://simpleproxy/locale/toolbar.properties?' + Math.random());
var activeTabHost = "";
Cu.import("resource://simpleproxy/pref-utils.js");
Cu.import("resource://simpleproxy/storage.js");
Cu.import("resource://simpleproxy/file-io.js");
Cu.import("chrome://simpleproxy/content/core.js");
Cu.import("resource:///modules/CustomizableUI.jsm");

var Toolbar = {
  createCustomButton: function (document) {
    var button = document.createElement("toolbarbutton");
    button.setAttribute("id", "simpleproxy-button");
    button.setAttribute("class", "toolbarbutton-1");
    button.setAttribute("type", "menu");
    button.setAttribute("label", "Simple Proxy");
    button.setAttribute("image", "chrome://simpleproxy/skin/icon.png");

    var popup = document.createElement("menupopup");
    popup.setAttribute("id", "simpleproxy-popup");
    popup.addEventListener("click", Toolbar.menuClick, false);
    popup.addEventListener("popupshowing", Toolbar.menuPopup, false);
    button.appendChild(popup);

    Toolbar.createPopupMenu(document, popup);

    return button;
  },
  createPopupMenu: function (document, popup) {
    var menu = document.createElement("menu")
    menu.setAttribute("id", "simpleproxy-profile-manage");
    menu.setAttribute("label", stringBundle.GetStringFromName("simpleproxy-profile-manage"));
    menu.setAttribute("class", "menu-iconic");
    popup.appendChild(menu);

    var _popup = document.createElement("menupopup");
    _popup.setAttribute("id", "simpleproxy-profile-popup");
    menu.appendChild(_popup);

    for (var i = 0; i < 11; i ++) {
      if (i > 8) {
        var separator = document.createElement("menuseparator");
        separator.setAttribute("id", "simpleproxy-profile-separator");
        _popup.appendChild(separator);
      }

      var item = document.createElement("menuitem");
      item.setAttribute("id", "simpleproxy-profile-" + i);
      item.setAttribute("label", stringBundle.GetStringFromName("simpleproxy-profile-" + i));
      item.setAttribute("type", "radio");
      _popup.appendChild(item);
    }

    var separator = document.createElement("menuseparator");
    separator.setAttribute("id", "simpleproxy-separator");
    popup.appendChild(separator);

    var menu = document.createElement("menu")
    menu.setAttribute("id", "simpleproxy-rule-manage");
    menu.setAttribute("class", "menu-iconic");
    menu.setAttribute("label", stringBundle.GetStringFromName("simpleproxy-rule-manage"));
    popup.appendChild(menu);

    var _popup = document.createElement("menupopup");
    _popup.setAttribute("id", "simpleproxy-rule-popup");
    menu.appendChild(_popup);

    for (var i = 0; i < 9; i ++) {
      var item = document.createElement("menuitem");
      item.setAttribute("id", "simpleproxy-rule-" + i);
      item.setAttribute("label", stringBundle.GetStringFromName("simpleproxy-profile-" + i));
      _popup.appendChild(item);
    }
  },
  menuClick: function (event) {
    for (var i = 0; i < 11; i ++) {
      if (event.target.id == "simpleproxy-profile-" + i) {
        Preferences.setValue({ name: "manage", type: "integer" }, i);
      }
    }

    for (var i = 0; i < 9; i ++) {
      if (event.target.id == "simpleproxy-rule-" + i) {
        if (Storage[i].file != undefined && Storage[i].fetch == undefined) {
          try {
            var list = window.atob(Storage[i].buffer);
            list = list + "\r\n||" + activeTabHost;
            Storage[i].buffer = window.btoa(list);
          }
          catch (e) {
            Storage[i].buffer = Storage[i].buffer + "\r\n||" + activeTabHost;
          }
          finally {
            Core.listData(Storage[i]);
            FileIO.saveToFile(Storage[i].file, Storage[i].buffer);
          }
        }
      }
    }
  },
  menuPopup: function (event) {
    var num = Preferences.getValue( { name: "number", type: "integer" } );
    var man = Preferences.getValue( { name: "manage", type: "integer" } );

    if (event.target.id == "simpleproxy-profile-popup") {
      event.target.querySelector("#simpleproxy-profile-" + man).setAttribute("checked", "true");

      for (var i = 0; i < 9; i ++) {
        if (i < num) {
          event.target.querySelector("#simpleproxy-profile-" + i).removeAttribute("hidden");
        }
        else {
          event.target.querySelector("#simpleproxy-profile-" + i).setAttribute("hidden", "true");
        }
      }
    }

    if (event.target.id == "simpleproxy-rule-popup") {
      for (var i = 0; i < 9; i ++) {
        if (i < num) {
          event.target.querySelector("#simpleproxy-rule-" + i).removeAttribute("hidden");
        }
        else {
          event.target.querySelector("#simpleproxy-rule-" + i).setAttribute("hidden", "true");
        }

        if (Storage[i].file != undefined && Storage[i].fetch == undefined) {
          event.target.querySelector("#simpleproxy-rule-" + i).removeAttribute("disabled");
        }
        else {
          event.target.querySelector("#simpleproxy-rule-" + i).setAttribute("disabled", "true");
        }
      }
    }

    if (event.target.id == "simpleproxy-popup") {
      try {
        activeTabHost = event.target.ownerDocument.getElementById("content").currentURI.hostPort;
      }
      catch (e) {
        activeTabHost = "";
      }

      if (activeTabHost != "") {
        event.target.querySelector("#simpleproxy-separator").removeAttribute("hidden");
        event.target.querySelector("#simpleproxy-rule-manage").removeAttribute("hidden");
      }
      else {
        event.target.querySelector("#simpleproxy-separator").setAttribute("hidden", "true");
        event.target.querySelector("#simpleproxy-rule-manage").setAttribute("hidden", "true");
      }
    }
  },
  on: function () {
    CustomizableUI.createWidget({
      id: "simpleproxy-button",
      type: "custom",
      defaultArea: CustomizableUI.AREA_NAVBAR,
      onBuild: Toolbar.createCustomButton
    });
  },
  off: function () {
    CustomizableUI.destroyWidget("simpleproxy-button");
  }
};
