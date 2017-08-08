/* global window, document */

const sites   = require('./sites');
const Command = require('./command')(sites, 'g');

require('../less/main.less');

const get = function (sel) { return document.getElementById(sel); };

// maintains completion state
let circularCompletions = [];

//-------------------------------------------------
// actions
//-------------------------------------------------

const setCommand = function (text) {
  if (text === undefined) { return; }
  get('command_input').value = text;
};

const getText = function () {
  return get('command_input').value.trim();
};

const getCommand = function () {
  return Command.parse(getText());
};

const submit = function () {
  const command = getCommand();
  if (!command) {
    return false;
  }
  window.location = command.url;
  return true;
};

const toggleCheatSheet = function () {
  const elem = get('cheatSheetDetails');
  elem.className = (elem.className === 'hide' ? '' : 'hide');
};

const reduceCheatSheet = function (text) {
  let lines = Command.cheatSheet.filter(line => line.indexOf(text) === 0);
  if (!lines.length) {
    lines = Command.cheatSheet;
  }
  get('cheatSheet').innerHTML = lines.join('\n');
};

const complete = function (text) {
  if (!text) { return; }
  const newText = (function () {
    if (circularCompletions.length > 0) {
      const i = circularCompletions.indexOf(text);
      return circularCompletions[(i + 1) % circularCompletions.length];
    }
    const completions = sites
      .filter(site => site.alias.indexOf(text) === 0)
      .map(site => site.alias);
    if (completions.length === 0) { return text; }  // no match, return original
    circularCompletions = completions.concat(text); // save completions and original text
    return completions[0];
  }());
  setCommand(newText);
};

//-------------------------------------------------
// deal with q= param
//-------------------------------------------------

const getParams = function (query) {
  const result = {};
  query = query || document.location.search.substring(1);
  query.split('&').forEach((param) => {
    const parts = param.split('=', 2);
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
  return true;
};

get('command_input').onkeyup = function (ev) {
  if (ev.keyCode !== 9) { // TAB
    circularCompletions = []; // reset completions, some other key was pressed
  }
  reduceCheatSheet(getText().split(/\s+/)[0]);
  return true;
};
