"use strict";

var EXPORTED_SYMBOLS = ["Pattern"];

var Pattern = {
  encode: function (string) {
    if (string.startsWith("||")) {
      var pattern = string.replace(/\./g, "\\.").replace(/\*/g, ".*").replace("^", "$").replace("||", "^https?://([^\\/\\.]+\\.)*");
    }
    else if (string.startsWith("|")) {
      var pattern = string.replace(/\./g, "\\.").replace(/\*/g, ".*").replace("^", "$").replace("|", "^");
    }
    else if (string.startsWith("/") && string.endsWith("/")) {
      var pattern = string.substring(1, string.length - 1);
    }
    else {
      var pattern = string.replace(/\./g, "\\.").replace(/\*/g, ".*").replace("^", "$");
    }
    return new RegExp(pattern);
  }
};
