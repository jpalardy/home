var sites   = require('./sites');
var Command = require('./command')(sites, 'g');

var get = function (sel) { return document.getElementById(sel); };

// maintains completion state
var circularCompletions = [];

//-------------------------------------------------
// actions
//-------------------------------------------------

var setCommand = function (text) {
  if (text === undefined) { return; }
  get('command_input').value = text;
};

var getText = function () {
  return get('command_input').value.trim();
};

var getCommand = function () {
  return Command.parse(getText());
};

var submit = function () {
  var command = getCommand();
  if (!command) {
    return false;
  }
  window.location = command.url;
};

var toggleCheatSheet = function () {
  var elem = get('cheatSheetDetails');
  elem.className = (elem.className === 'hide' ? '' : 'hide');
};

var reduceCheatSheet = function (text) {
  var lines = Command.cheatSheet.filter(function (line) {
    return line.indexOf(text) === 0;
  });
  if (!lines.length) {
    lines = Command.cheatSheet;
  }
  get('cheatSheet').innerHTML = lines.join('\n');
};

var complete = function (text) {
  if (!text) { return; }
  var newText = (function () {
    if (circularCompletions.length > 0) {
      var i = circularCompletions.indexOf(text);
      return circularCompletions[(i + 1) % circularCompletions.length];
    }
    var completions = sites.filter(function (site) {
      return site.alias.indexOf(text) === 0;
    }).map(function (site) { return site.alias; });
    if (completions.length === 0) { return text; }  // no match, return original
    circularCompletions = completions.concat(text); // save completions and original text
    return completions[0];
  }());
  setCommand(newText);
};

//-------------------------------------------------
// deal with q= param
//-------------------------------------------------

var getParams = function (query) {
  var result = {};
  query = query || document.location.search.substring(1);
  query.split('&').forEach(function (param) {
    var parts = param.split('=', 2);
    result[parts[0]] = decodeURIComponent(parts[1]).replace(/\+/g, ' ');
  });
  return result;
};

setCommand(getParams().q);
submit();

//-------------------------------------------------
// event handlers
//-------------------------------------------------

get('command_form').onsubmit = function () {
  submit();
  return false;
};

document.body.onkeyup = function (ev) {
  if (ev.keyCode === 27) { // ESC
    toggleCheatSheet();
    return false;
  }
  if (ev.keyCode === 191) { // forward slash '/'
    get('command_input').focus();
    return false;
  }
  return true;
};

get('command_input').onkeydown = function (ev) {
  if (ev.keyCode === 27) { // ESC
    ev.preventDefault();   // don't clear the text field
    return false;
  }
  if (ev.keyCode === 9) {  // TAB
    ev.preventDefault();
    complete(getText());
    return false;
  }
};

get('command_input').onkeyup = function (ev) {
  if (ev.keyCode !== 9) { // TAB
    circularCompletions = []; // reset completions, some other key was pressed
  }
  reduceCheatSheet(getText().split(/\s+/)[0]);
  return true;
};
