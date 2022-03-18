/* global window, document, sessionStorage */

import websites from "./sites/websites";
import docs from "./sites/docs";
import {Parser} from "./command";
import Completer from "./completer";

const sites = [...websites, ...docs];
const parser = Parser(sites, "g");

//-------------------------------------------------
// convenience
//-------------------------------------------------

const ELEMENTS = (() => {
  const input = document.querySelector("#content input") as HTMLInputElement;
  const form = document.querySelector("#content form") as HTMLFormElement;

  if (!input) {
    throw Error("missing #content input");
  }

  if (!form) {
    throw Error("missing #content form");
  }

  return {input, form};
})();

//-------------------------------------------------
// actions
//-------------------------------------------------

const lastText = {
  get() {
    if ("sessionStorage" in window) {
      return sessionStorage.getItem("lastText");
    }
    return null;
  },
  set(value: string) {
    if ("sessionStorage" in window) {
      sessionStorage.setItem("lastText", value);
    }
  },
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
    const command = parser.parse(text);
    lastText.set(text);
    window.location.href = command.url;
  },
};

//-------------------------------------------------
// deal with q= param
//-------------------------------------------------

(() => {
  const getParams = (query: string) => {
    const params = query.split("&").map((param): [string, string] => {
      const [k, v = ""] = param.split("=", 2);
      return [k, decodeURIComponent(v).replace(/\+/g, " ")];
    });
    return new Map(params);
  };

  // restore textfield on back button
  const lt = (() => {
    const entries = performance.getEntriesByType("navigation");
    if (entries[0]?.entryType === "back_forward") {
      return lastText.get() || "";
    }
    return "";
  })();

  if (lt) {
    ACTIONS.setCommand(lt);
    return;
  }

  const params = getParams(document.location.search.substring(1));
  const q = params.get("q");
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
    if (document.activeElement?.tagName.toLowerCase() !== "input") {
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

  let iter: null | Generator<string, never, unknown>;
  let right = "";
  ELEMENTS.form.addEventListener("keydown", (ev: KeyboardEvent) => {
    if (ev.key === "Escape") {
      ACTIONS.setCommand(""); // clear
      iter = null;
      return;
    }
    if (ev.key !== "Tab") {
      iter = null;
      return;
    }
    // Tab
    ev.preventDefault();
    if (iter) {
      ACTIONS.setCommand(iter.next().value, right);
      return;
    }
    const currentText = ACTIONS.getText();
    const curPos = (ev.target as HTMLInputElement).selectionStart || 0;
    const left = currentText.slice(0, curPos);
    right = currentText.slice(curPos);
    iter = completer.matches(left, {skipSameFirst: true});
    ACTIONS.setCommand(iter.next().value, right);
  }, false);
}
