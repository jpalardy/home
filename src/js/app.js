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
  setCommand(left, right = "") {
    const text = `${left}${right}`;
    if (text === undefined) {
      return;
    }
    const value = text.trim();
    get("command_input").value = value;
    get("command_input").setSelectionRange(left.length, left.length);
    this.updateLink(value);
  },

  updateLink(value) {
    const command = Command.parse(value);
    if (command) {
      get("logo").href = command.url;
      return;
    }
    get("logo").href = "http://home.jpalardy.com/";
  },

  getText() {
    return get("command_input").value.trim();
  },

  submit(redirect = true) {
    const command = Command.parse(this.getText());
    if (!command) {
      return;
    }
    logUsage(command.site.alias);
    lastText.set(this.getText());
    if (redirect) {
      window.location = command.url;
    }
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

  get("logo").addEventListener("click", () => {
    ACTIONS.submit(false);
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
  let right = "";
  commandForm.addEventListener("keydown", ev => {
    // not TAB
    if (ev.keyCode !== 9) {
      iter = null;
      return;
    }
    // TAB
    ev.preventDefault();
    if (iter) {
      ACTIONS.setCommand(iter.next().value, right);
      return;
    }
    const currentText = ACTIONS.getText();
    const curPos = ev.target.selectionStart;
    const left = currentText.slice(0, curPos);
    right = currentText.slice(curPos);
    iter = completer.matches(left, {skipSameFirst: true});
    ACTIONS.setCommand(iter.next().value, right);
  });

  commandForm.addEventListener("keyup", () => {
    ACTIONS.updateLink(get("command_input").value);
  });
}
