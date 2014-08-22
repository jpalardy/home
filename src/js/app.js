/* global document, window, console, Command, sites */
(function (exports) {
  'use strict';

  Command.sites = (function () {
    var result = {};
    sites.forEach(function (site) {
      result[site.alias] = site;
    });
    return result;
  }());
  Command.default_sites = ['ddg'];

  var getCommand = function () {
    var text = document.getElementById('command_input').value;
    return Command.parse(text);
  };

  var makeLinks = function (command) {
    if (!command) {
      document.getElementById('links').innerHTML = "";
      return;
    }
    var html = command.links.map(function (link) {
      return '<a href="' + link.url + '">' + link.site + '</a>';
    }).join(' ');
    document.getElementById('links').innerHTML = html;
  };

  //-------------------------------------------------

  var handleForm = function () {
    try {
      var command = getCommand();
      if (!command) {
        return false;
      }
      command.urls.slice(1).forEach(function (url) {
        window.open(url, '_blank');
      });
      window.location = command.urls[0];
    } catch (e) {
      console.error(e);
    }
    return false;
  };

  var handleGlobalKey = function (ev) {
    if (ev.keyCode === 27) { // ESC
      var elem = document.getElementById("cheatSheetDetails");
      elem.open = !elem.open;
      return false;
    }
    return true;
  };

  var handleKey = function (ev) {
    if (ev.keyCode === 27) { // ESC
      ev.preventDefault();   // don't clear the text field
      return false;
    }
    var command = getCommand();
    makeLinks(command);
    return true;
  };

  exports.handleForm      = handleForm;
  exports.handleGlobalKey = handleGlobalKey;
  exports.handleKey       = handleKey;
}(this.module && this.module.exports || this));
