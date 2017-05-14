"use strict";

var EXPORTED_SYMBOLS = ["FileIO"];

var Cc = Components.classes, Ci = Components.interfaces, Cu = Components.utils;
Cu.import("resource://gre/modules/osfile.jsm");

var FileIO = {
  folder: OS.Path.join(OS.Constants.Path.profileDir, "SimpleProxy"),
  joinPath: function (base, addon) {
    return OS.Path.join(base, addon);
  },
  makeFolder: function (path) {
    OS.File.makeDir(path);
  },
  moveFile: function (object, target) {
    OS.File.move(object, target);
  },
  pathFileName: function (path) {
    var data = OS.Path.split(Storage[i].list).components;
    return data[data.length - 1];
  },
  uriFileName: function (uri) {
    var data = uri.split("/");
    return data[data.length - 1];
  },
  fileInfo: function (storage, callback) {
    OS.File.stat(storage.file).then(
      function onSuccess(data) {
        storage.date = Date.parse(data.lastModificationDate), storage.fetch = false;
        callback(storage);
      },
      function onFailure(reason) {
        if (reason instanceof OS.File.Error && reason.becauseNoSuchFile) {
          storage.fetch = true;
          callback(storage);
        }
      }
    );
  },
  loadFromFile: function (storage, callback) {
    OS.File.read(storage.file).then(
      function onSuccess(stream) {
        var decoder = new TextDecoder();
        storage.buffer = decoder.decode(stream);
        callback(storage);
      }
    );
  },
  saveToFile: function (file, stream) {
    OS.File.writeAtomic(file, stream, {encoding: "utf-8"}).then(
      function onSuccess() {
        var nsIFile = Cc["@mozilla.org/file/local;1"].createInstance(Ci.nsIFile);
        nsIFile.initWithPath(file);
        nsIFile.reveal();
      }
    );
  }
};
