/* global window, document, localStorage, sessionStorage, performance */

const websites = require("./websites");
const docs = require("./docs");

const sites = [...websites, ...docs];

const Command = require("./command")(sites, "g");
const Completer = require("./completer");

// import CSS for webpack
require("../less/main.less");

//-------------------------------------------------
// convenience
//-------------------------------------------------

const get = document.getElementById.bind(document);

function guard(predicate, f, fallback = undefined) {
  return (...args) => {
    if (typeof predicate === "function" ? predicate() : predicate) {
      return f(...args);
    }
    return fallback;
  };
}

//-------------------------------------------------
// actions
//-------------------------------------------------

const logUsage = guard(window.localStorage, alias => {
  if (!localStorage.getItem("logging")) {
    return;
  }
  const usage = JSON.parse(localStorage.getItem("usage")) || {};
  usage[Date.now()] = alias;
  localStorage.setItem("usage", JSON.stringify(usage));
});

const lastText = {
  get: guard(window.sessionStorage, () => sessionStorage.getItem("lastText")),
  set: guard(window.sessionStorage, value => sessionStorage.setItem("lastText", value)),
};

const ACTIONS = {
  setCommand(text) {
    if (text === undefined) {
      return;
    }
    get("command_input").value = text.trim();
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
    lastText.set(this.getText());
    window.location = command.url;
  },
};

//-------------------------------------------------
// deal with q= param
//-------------------------------------------------

(() => {
  const getParams = function(query = document.location.search.substring(1)) {
    const result = {};
    query.split("&").forEach(param => {
      const parts = param.split("=", 2);
      result[parts[0]] = decodeURIComponent(parts[1]).replace(/\+/g, " ");
    });
    return result;
  };

  // restore textfield on back button
  const getLastText = guard(window.performance, () => {
    if (performance.navigation.type === performance.navigation.TYPE_BACK_FORWARD) {
      return lastText.get();
    }
    return "";
  });

  const lt = getLastText();
  if (lt) {
    ACTIONS.setCommand(lt);
    return;
  }

  const {q} = getParams();
  if (q) {
    ACTIONS.setCommand(q);
    ACTIONS.submit();
  }
})();

//-------------------------------------------------
// event handlers
//-------------------------------------------------

{
  document.body.addEventListener("keydown", () => {
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
}
