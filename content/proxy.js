"use strict";

var EXPORTED_SYMBOLS = ["Proxy"];

var Cc = Components.classes, Ci = Components.interfaces, Cu = Components.utils;
var pps = Cc["@mozilla.org/network/protocol-proxy-service;1"].getService(Ci.nsIProtocolProxyService);
Cu.import("resource://simpleproxy/storage.js");

var Proxy = {
  applyFilter: function (service, uri, proxy) {
    var white = Storage[999];
    if (white.length > 0) {
      for (var i in white) {
        var rule = white[i];
        if (rule.test(uri.spec)) {
          return proxy;
        }
      }
    }

    for (var i in Storage) {
      if (Storage[i].disabled == true || Storage[i].match == undefined || Storage[i].proxy == undefined) continue;

      var match = Storage[i].match, server = Storage[i].proxy;
      if (match.length > 0) {
        for (var x in match) {
          var rule = match[x];
          if (rule.test(uri.spec)) {
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
