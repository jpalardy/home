/* global window, document, localStorage */

const websites = require("./websites");
const apis = require("./apis");

const sites = [...websites, ...apis];

const Command = require("./command")(sites, "g");
const Completer = require("./completer");

// import CSS for webpack
require("../less/main.less");

const get = document.getElementById.bind(document);

//-------------------------------------------------
// actions
//-------------------------------------------------

const logUsage = function(alias) {
  if (!window.localStorage) {
    return;
  }
  if (!localStorage.getItem("logging")) {
    return;
  }
  const usage = JSON.parse(localStorage.getItem("usage")) || {};
  usage[Date.now()] = alias;
  localStorage.setItem("usage", JSON.stringify(usage));
};

const ACTIONS = {
  setCommand(text) {
    if (text === undefined) {
      return;
    }
    get("command_input").value = text;
  },

  getText() {
    return get("command_input").value.trim();
  },

  submit() {
    const command = Command.parse(this.getText());
    if (!command) {
      return;
    }
    logUsage(command.site.alias);
    window.location = command.url;
  },

  toggleCheatSheet() {
    get("cheatSheetDetails").classList.toggle("hide");
  },

  reduceCheatSheet(text) {
    get("cheatSheet").innerHTML = Command.cheatSheet(text).join("\n");
  },
};

//-------------------------------------------------
// deal with q= param
//-------------------------------------------------

{
  const getParams = function(query = document.location.search.substring(1)) {
    const result = {};
    query.split("&").forEach(param => {
      const parts = param.split("=", 2);
      result[parts[0]] = decodeURIComponent(parts[1]).replace(/\+/g, " ");
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
  document.body.addEventListener("keydown", ev => {
    if (ev.keyCode === 27) {
      // ESC
      ACTIONS.toggleCheatSheet();
    }
    // any key focuses on search field
    if (document.activeElement.tagName.toLowerCase() !== "input") {
      get("command_input").focus();
    }
  });

  //-------------------------------------------------
  // some state
  const completer = new Completer(sites.map(site => site.alias).sort());
  const commandForm = get("command_form");
  //-------------------------------------------------

  commandForm.addEventListener("submit", ev => {
    ev.preventDefault();
    ACTIONS.submit();
  });

  let iter;
  commandForm.addEventListener("keydown", ev => {
    if (ev.keyCode === 9) {
      // TAB
      ev.preventDefault();
      if (iter) {
        ACTIONS.setCommand(iter.next().value);
        return;
      }
      const currentText = ACTIONS.getText();
      iter = completer.matches(currentText);
      let replacement = iter.next().value;
      // if the first completion is what we typed, try next one
      if (currentText === replacement) {
        replacement = iter.next().value;
      }
      ACTIONS.setCommand(replacement);
      return;
    }
    // anything else...
    iter = null;
  });

  commandForm.addEventListener("keyup", () => {
    ACTIONS.reduceCheatSheet(ACTIONS.getText().split(/\s+/)[0]);
  });
}
