/* global window, document, sessionStorage, performance */

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

const ELEMENTS = {
  input: document.getElementById("command_input"),
  form: document.getElementById("command_form"),
};

function guard(predicate, f) {
  return predicate ? f : () => {};
}

//-------------------------------------------------
// actions
//-------------------------------------------------

const lastText = {
  get: guard(window.sessionStorage, () => sessionStorage.getItem("lastText")),
  set: guard(window.sessionStorage, (value) => sessionStorage.setItem("lastText", value)),
};

const ACTIONS = {
  setCommand(left = "", right = "") {
    const text = `${left}${right}`.trim();
    ELEMENTS.input.value = text;
    ELEMENTS.input.setSelectionRange(left.length, left.length);
  },

  getText() {
    return ELEMENTS.input.value.trim();
  },

  submit() {
    const text = this.getText();
    const command = Command.parse(text);
    if (!command) {
      return;
    }
    lastText.set(text);
    window.location = command.url;
  },
};

//-------------------------------------------------
// deal with q= param
//-------------------------------------------------

(() => {
  const getParams = (query = document.location.search.substring(1)) => {
    const result = {};
    query.split("&").forEach((param) => {
      const [k, v = ""] = param.split("=", 2);
      if (!k) {
        return;
      }
      result[k] = decodeURIComponent(v).replace(/\+/g, " ");
    });
    return result;
  };

  // restore textfield on back button
  const getLastText = guard(window.performance, () => {
    const entries = performance.getEntriesByType("navigation");
    // eventually: use optional chaining...
    if (entries[0] && entries[0].type === "back_forward") {
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
      ELEMENTS.input.focus();
    }
  });

  //-------------------------------------------------
  // some state
  const completer = new Completer(sites.map((site) => site.alias).sort());
  //-------------------------------------------------

  ELEMENTS.form.addEventListener("submit", (ev) => {
    ev.preventDefault();
    ACTIONS.submit();
  });

  let iter;
  let right = "";
  ELEMENTS.form.addEventListener("keydown", (ev) => {
    // ESC
    if (ev.keyCode === 27) {
      ACTIONS.setCommand(""); // clear
      iter = null;
      return;
    }
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
}
