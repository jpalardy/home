/* global window, document */

const sites   = require('./sites');
const Command = require('./command')(sites, 'g');

// import CSS for webpack
require('../less/main.less');

const get = document.getElementById.bind(document);

//-------------------------------------------------
// actions
//-------------------------------------------------

const ACTIONS = {
  setCommand(text) {
    if (text === undefined) { return; }
    get('command_input').value = text;
  },

  getText() {
    return get('command_input').value.trim();
  },

  submit() {
    const command = Command.parse(this.getText());
    if (!command) {
      return;
    }
    //console.log("*** window.location =", command.url)
    window.location = command.url;
  },

  toggleCheatSheet() {
    get('cheatSheetDetails').classList.toggle('hide');
  },

  reduceCheatSheet(text) {
    get('cheatSheet').innerHTML = Command.cheatSheet(text).join('\n');
  },
};

//-------------------------------------------------
// deal with q= param
//-------------------------------------------------

{
  const getParams = function (query) {
    const result = {};
    query = query || document.location.search.substring(1);
    query.split('&').forEach((param) => {
      const parts = param.split('=', 2);
      result[parts[0]] = decodeURIComponent(parts[1]).replace(/\+/g, ' ');
    });
    return result;
  };

  ACTIONS.setCommand(getParams().q);
  ACTIONS.submit();
}

//-------------------------------------------------
// event handlers
//-------------------------------------------------

{
  document.body.addEventListener('keydown', (ev) => {
    if (ev.keyCode === 27) { // ESC
      ACTIONS.toggleCheatSheet();
    }
    // any key focuses on search field
    if (document.activeElement.tagName.toLowerCase() !== 'input') {
      get('command_input').focus();
    }
  });

  //-------------------------------------------------
  // maintains completion state
  let circularCompletions = [];
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
    ACTIONS.setCommand(newText);
  };
  //-------------------------------------------------

  const commandForm = get('command_form');

  commandForm.addEventListener('submit', (ev) => {
    ev.preventDefault();
    ACTIONS.submit();
  });

  commandForm.addEventListener('keydown', (ev) => {
    if (ev.keyCode === 9) {  // TAB
      ev.preventDefault();
      complete(ACTIONS.getText());
    }
  });

  commandForm.addEventListener('keyup', (ev) => {
    if (ev.keyCode !== 9) { // TAB
      circularCompletions = []; // reset completions, some other key was pressed
    }
    ACTIONS.reduceCheatSheet(ACTIONS.getText().split(/\s+/)[0]);
  });
}
