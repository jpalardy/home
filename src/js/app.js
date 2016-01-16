var Command = require('./command');
var sites   = require('./sites');

var cheatSheet = [];

var get = function (sel) { return document.getElementById(sel); };

//-------------------------------------------------

Command.sites = (function () {
  var result = {};
  sites.forEach(function (site) {
    site.visit = site.visit || site.search.match('^https?://[^/]+/')[0];
    site.alias = site.alias || site.name;
    result[site.alias] = site;
  });
  cheatSheet = sites.filter(function (site) {
    return !site.hide;
  }).map(function (site) {
    return site.alias + '\t' + site.name;
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
    get('links').innerHTML = '';
    return;
  }
  var html = command.links.map(function (link) {
    return '<a href="' + link.url + '">' + link.site + '</a>';
  }).join(' ');
  get('links').innerHTML = html;
};

//-------------------------------------------------

get('command_form').onsubmit = function () {
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
    var elem = get('cheatSheetDetails');
    elem.className = (elem.className === 'hide' ? '' : 'hide');
    return false;
  }
  return true;
};

var circularCompletions = [];
get('command_input').onkeydown = function (ev) {
  if (ev.keyCode === 27) { // ESC
    ev.preventDefault();   // don't clear the text field
    return false;
  }
  if (ev.keyCode === 9) {  // TAB
    ev.preventDefault();
    var text = get('command_input').value;
    if (!text) { return false; }
    var newText = (function () {
      if (circularCompletions.length > 0) {
        var i = circularCompletions.indexOf(text);
        return circularCompletions[(i + 1) % circularCompletions.length];
      }
      var completions = sites.filter(function (site) { return site.alias.indexOf(text) === 0; }).map(function (site) { return site.alias; });
      if (completions.length === 0) { return text; }  // no match, return original
      circularCompletions = completions.concat(text); // save completions and original text
      return completions[0];
      throw new Error("no completions for: " + text);
    }());
    get('command_input').value = newText;
    return false;
  }
};

get('command_input').onkeyup = function (ev) {
  var command = getCommand();
  makeLinks(command);

  if (ev.keyCode !== 9) { // TAB
    circularCompletions = []; // reset completions, some other key was pressed
  }

  var text = get('command_input').value.trim().split(/\s+/)[0];
  var lines = cheatSheet.filter(function (line) {
    return line.indexOf(text) === 0;
  });
  if (!lines.length) {
    lines = cheatSheet;
  }
  get('cheatSheet').innerHTML = lines.join('\n');

  return true;
};
