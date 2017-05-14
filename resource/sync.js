"use strict";

var EXPORTED_SYMBOLS = ["Synchronize"];

var Cu = Components.utils;
Cu.import("resource://gre/modules/Downloads.jsm");
Cu.import("resource://simpleproxy/file-io.js");

var Synchronize = {
  fetch: function (storage, callback, probe) {
    probe = probe || 0;
    if (probe > 3) return;
    probe ++;

    probe ++;
    var temp = storage.file + "_sp";
    Downloads.fetch(storage.list, temp, {isPrivate: true}).then(
      function onSuccess() {
        FileIO.moveFile(temp, storage.file);
        callback(storage);
      },
      function onFailure() {
        Synchronize.fetch(storage, callback, probe);
      }
    );
  }
};
