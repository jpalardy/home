import * as Sites from "./sites";
import Command = require("./command");
import Completer = require("./completer");

//-------------------------------------------------
// combine sites
//-------------------------------------------------

function getLocalSites(): Sites.FullSite[] {
  if (!("localStorage" in window)) {
    return [];
  }
  let parsedJSON: unknown[] = [];
  try {
    parsedJSON = JSON.parse(localStorage.getItem("localSites") || "[]");
  } catch (err) {
    console.error(err);
  }
  if (!Array.isArray(parsedJSON)) {
    return [];
  }
  return parsedJSON.filter(Sites.assertSiteConfig).map(Sites.convertToFullSite);
}

const combinedSites = Sites.sites.concat(getLocalSites());
const parseCommand = Command.parser(combinedSites, "g");

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
    const command = parseCommand(text);
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
      const [k = "", v = ""] = param.split("=", 2);
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

  const q = getParams(document.location.search.substring(1)).get("q");
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
  const aliases = combinedSites.map((site) => site.alias).sort();
  //-------------------------------------------------

  ELEMENTS.form.addEventListener("submit", (ev) => {
    ev.preventDefault();
    ACTIONS.submit();
  });

  let completions: null | Completer.Completions;
  let right = "";
  ELEMENTS.form.addEventListener(
    "keydown",
    (ev: KeyboardEvent) => {
      if (ev.key === "Escape") {
        ACTIONS.setCommand(""); // clear
        completions = null;
        return;
      }
      if (ev.ctrlKey && ev.key === "u") {
        ACTIONS.setCommand(""); // clear
        completions = null;
        return;
      }
      if (ev.ctrlKey && ev.key === "w") {
        const currentText = ACTIONS.getText();
        // drop the last workd
        const currentWords = currentText.trimEnd().split(" ");
        ACTIONS.setCommand(currentWords.slice(0, -1).join(" "));
        completions = null;
        return;
      }
      if (ev.key !== "Tab") {
        completions = null;
        return;
      }
      // Tab
      ev.preventDefault();
      if (completions) {
        let value: string;
        [value, completions] = Completer.cycle(completions);
        ACTIONS.setCommand(value, right);
        return;
      }
      const currentText = ACTIONS.getText();
      const curPos = (ev.target as HTMLInputElement).selectionStart || 0;
      const left = currentText.slice(0, curPos);
      right = currentText.slice(curPos);
      completions = Completer.init(aliases, left);
      {
        let value: string;
        [value, completions] = Completer.cycle(completions);
        // completion matched text, try to cycle once
        if (value === left) {
          [value, completions] = Completer.cycle(completions);
        }
        ACTIONS.setCommand(value, right);
      }
    },
    false
  );
}
