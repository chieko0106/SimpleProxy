"use strict";

var EXPORTED_SYMBOLS = ["Proxy"];

var Cc = Components.classes, Ci = Components.interfaces, Cu = Components.utils;
var pps = Cc["@mozilla.org/network/protocol-proxy-service;1"].getService(Ci.nsIProtocolProxyService);
Cu.import("resource://simpleproxy/storage.js");

var Proxy = {
  applyFilter: function (service, uri, proxy) {
    for (var i in Storage) {
      if (Storage[i].disabled == true || Storage[i].proxy == undefined || Storage[i].file == undefined) continue;

      var white = Storage[i].white, match = Storage[i].match, server = Storage[i].proxy;

      if (white != undefined) {
        for (var x in white) {
          var rule = white[x];
          if (rule.test(uri.spec)) {
            return proxy;
          }
        }
      }

      if (match != undefined) {
        for (var y in match) {
          var _rule = match[y];
          if (_rule.test(uri.spec)) {
            return server;
          }
        }
      }
    }

    return proxy;
  },
  on: function () {
    pps.registerFilter(Proxy, 3);
  },
  off: function () {
    pps.unregisterFilter(Proxy);
  }
};
