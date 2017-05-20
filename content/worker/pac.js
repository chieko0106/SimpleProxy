"use strict";

var EXPORTED_SYMBOLS = ["PAC"];

var Cu = Components.utils;
Cu.import("resource://simpleproxy/pref-utils.js");
Cu.import("resource://simpleproxy/storage.js");
Cu.import("resource://simpleproxy/file-io.js");

var numX = "function FindProxyForURL(url, host) {if (host == '127.0.0.1' || host == 'localhost') {return 'DIRECT';} for (var i in WhiteRule) {var rule = WhiteRule[i]; if (rule.test(url)) {return 'DIRECT';}} for (var i in ProxyRule) {var match = ProxyRule[i].match, proxy = ProxyRule[i].proxy; for (var x in match) {var rule = match[x]; if (rule.test(url)) {return proxy;}}} return 'DIRECT';}"
var num1 = "function FindProxyForURL(url, host) {if (host == '127.0.0.1' || host == 'localhost') {return 'DIRECT';} for (var i in WhiteRule) {var rule = WhiteRule[i]; if (rule.test(url)) {return 'DIRECT';}} var match = ProxyRule.match, proxy = ProxyRule.proxy; for (var i in match) {var rule = match[i]; if (rule.test(url)) {return proxy;}} return 'DIRECT';}"
var PAC = {
  make: function () {
    var num = Preferences.getValue( { name: "number", type: "integer" } );
    var white = PAC.white(), match = PAC.match();
    if (match == "") return;

    var file = FileIO.joinPath(FileIO.folder, "SimpleProxy.pac");
    if (num == 1) {
      var buffer = white + "\r\n" + match + "\r\n" + num1;
    }
    else {
      var buffer = white + "\r\n" + match + "\r\n" + numX;
    }
    FileIO.saveToFile(file, buffer);
  },
  white: function () {
    var white = Storage[999];
    if (white.length == 0) return "";

    return "var WhiteRule = [" + white.join() + "];";
  },
  match: function () {
    var num = Preferences.getValue( { name: "number", type: "integer" } );
    var array = [];
    if (num == 1) {
      if (Storage[0].match == undefined || Storage[0].match.length == 0 || Storage[0].host == undefined) return "";
      var match = Storage[0].match, host = Storage[0].host;
      var _match = "match: [" + match.join() + "],";
      var _host = "proxy: 'PROXY " + host + "'";
      return "var ProxyRule = {" + _match + _host + "};";
    }
    else {
      for (var i = 0; i < num; i ++) {
        if (Storage[i].match == undefined || Storage[i].match.length == 0 || Storage[i].host == undefined) continue;
        var match = Storage[i].match, host = Storage[i].host;
        var _match = "match: [" + match.join() + "],";
        var _host = "proxy: 'PROXY " + host + "'";
        array.push(i + ": {" + _match + _host + "}");
      }
      if (array.length == 0) return "";
      return "var ProxyRule = {" + array.join() + "};";
    }
  }
};
