var Command = require('./command');
var sites   = require('./sites');

var cheatSheet = [];

var get = function (sel) { return document.getElementById(sel); };

//-------------------------------------------------

Command.sites = (function () {
  var result = {};
  sites.forEach(function (site) {
    site.visit = site.visit || site.search.match("^https?://[^/]+/")[0];
    result[site.alias] = site;
  });
  cheatSheet = sites.filter(function (site) {
    return !site.hide;
  }).map(function (site) {
    return site.alias + "\t" + site.name;
  });
  return result;
}());
Command.default_sites = ['ddg'];

var getCommand = function () {
  var text = get('command_input').value;
  return Command.parse(text);
};

var makeLinks = function (command) {
  if (!command) {
    get('links').innerHTML = "";
    return;
  }
  var html = command.links.map(function (link) {
    return '<a href="' + link.url + '">' + link.site + '</a>';
  }).join(' ');
  get('links').innerHTML = html;
};

//-------------------------------------------------

get("command_form").onsubmit = function () {
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

document.body.onkeyup = function (ev) {
  if (ev.keyCode === 27) { // ESC
    var elem = get("cheatSheetDetails");
    elem.className = (elem.className === "hide" ? "" : "hide");
    return false;
  }
  return true;
};

get("command_input").onkeydown = function (ev) {
  if (ev.keyCode === 27) { // ESC
    ev.preventDefault();   // don't clear the text field
    return false;
  }
};

get("command_input").onkeyup = function () {
  var command = getCommand();
  makeLinks(command);

  var text = get('command_input').value.trim().split(/\s+/)[0];
  var lines = cheatSheet.filter(function (line) {
    return line.indexOf(text) === 0;
  });
  if (!lines.length) {
    lines = cheatSheet;
  }
  get('cheatSheet').innerHTML = lines.join("\n");

  return true;
};
