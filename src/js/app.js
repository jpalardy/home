var Command = require('./command');
var sites   = require('./sites');

var cheatSheet = document.getElementById('cheatSheet').innerHTML;

//-------------------------------------------------

Command.sites = (function () {
  var result = {};
  sites.forEach(function (site) {
    site.visit = site.visit || site.search.match("^https?://[^/]+/")[0];
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

document.getElementById("command_form").onsubmit = function () {
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
    var elem = document.getElementById("cheatSheetDetails");
    elem.className = (elem.className === "hide" ? "" : "hide");
    return false;
  }
  return true;
};

document.getElementById("command_input").onkeydown = function (ev) {
  if (ev.keyCode === 27) { // ESC
    ev.preventDefault();   // don't clear the text field
    return false;
  }
};

document.getElementById("command_input").onkeyup = function () {
  var command = getCommand();
  makeLinks(command);

  var text = document.getElementById('command_input').value;
  var lines = cheatSheet.split("\n").filter(function (line) {
    return line.indexOf(text) === 0;
  }).join("\n");
  lines = lines || cheatSheet;
  document.getElementById('cheatSheet').innerHTML = lines;

  return true;
};
