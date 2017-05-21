"use strict";

var EXPORTED_SYMBOLS = ["Events"];

var Cc = Components.classes, Ci = Components.interfaces, Cu = Components.utils;
var pps = Cc["@mozilla.org/network/protocol-proxy-service;1"].getService(Ci.nsIProtocolProxyService);
Cu.import("resource://simpleproxy/pref-utils.js");
Cu.import("resource://simpleproxy/file-io.js");
Cu.import("resource://simpleproxy/storage.js");
Cu.import("chrome://simpleproxy/content/core.js");

var Events = {
  pendingOption: function () {
    try {
      Preferences.getValue( { name: "number", type: "integer" } );
      Preferences.getValue( { name: "manage", type: "integer" } );
    }
    catch (e) {
      Preferences.setValue( { name: "number", type: "integer" } , 1);
      Preferences.setValue( { name: "manage", type: "integer" } , 10);
    }
    finally {
      var num = Preferences.getValue( { name: "number", type: "integer" } );
      var man = Preferences.getValue( { name: "manage", type: "integer" } );
      if (num > 9) {
        num = 9;
      }
      else if (num < 1) {
        num = 1;
      }
      var _num = num - 1;
      if (man > 10) {
        man = 10;
      }
      else if (man < 0) {
        man = 0;
      }
      else if (man != 9 && man != 10) {
        if (man > _num) {
          man = _num;
        }
      }
      Preferences.setValue( { name: "number", type: "integer" } , num);
      Preferences.setValue( { name: "manage", type: "integer" } , man);
    }

    Storage[999] = [];

    for (var i = 0; i < 9; i ++) {
      Storage[i] = {};
      if (man == 9) {
        Storage[i].disabled = true;
      }
      else if (man == 10) {
        Storage[i].disabled = false;
      }
      else {
        if (i == man) {
          Storage[i].disabled = false;
        }
        else {
          Storage[i].disabled = true;
        }
      }

      if (i < num ) {
        try {
          Storage[i].list = Preferences.getValue( { name: "list." + i, type: "string" } );
          Events.getPattern(Storage[i]);
        }
        catch (e) {
          Preferences.setValue( { name: "list." + i, type: "string" }, "");
        }

        try {
          Storage[i].protocol = Preferences.getValue( { name: "protocol." + i, type: "string" } );
          Storage[i].address = Preferences.getValue( { name: "address." + i, type: "string" } );
          Storage[i].port = Preferences.getValue( { name: "port." + i, type: "integer" } );
          Events.getServer(Storage[i]);
        }
        catch (e) {
          Preferences.setValue( { name: "protocol." + i, type: "string" }, "http");
          Preferences.setValue( { name: "address." + i, type: "string" }, "");
          Preferences.setValue( { name: "port." + i, type: "integer" }, 8080);
        }
      }
    }

    Events.pendingAddon();
  },
  pendingAddon: function () {
    FileIO.makeFolder(FileIO.folder);
  },
  getServer: function (storage) {
    if (["http", "socks", "socks4"].indexOf(storage.protocol) == -1 || storage.address == "") return;

    storage.host = storage.address + ":" + storage.port;
    storage.proxy = pps.newProxyInfo(storage.protocol, storage.address, storage.port, 1, 0, null);
  },
  getPattern: function (storage) {
    if (storage.list.match(/^https?:\/\/([^\/]+\/)+[^\\\?\/\*\|<>:"]+\.(txt|ini)$/i)) {
      storage.file = FileIO.joinPath(FileIO.folder, FileIO.uriFileName(storage.list));
      FileIO.fileInfo(storage, Core.subscription);
    }
    else if (storage.list.match(/^\w:\\([^\\]+\\)*[^\\\?\/\*\|<>:"]+\.(txt|ini)$/i)) {
      storage.file = storage.list;
      Core.listData(storage);
    }
    else if (storage.list.match(/^[^\\\?\/\*\|<>:"]+\.(txt|ini)$/i)) {
      storage.file = FileIO.joinPath(FileIO.folder, storage.list);
      Core.listData(storage);
    }

    return;
  },
  on: function () {
    Events.pendingOption();
    Preferences.on("", Events.pendingOption);
  },
  off: function () {
    Preferences.off("", Events.pendingOption);
  }
};
