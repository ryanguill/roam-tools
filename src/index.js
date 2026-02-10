import $ from "jquery";
import { Remarkable } from "remarkable";
import { applyTransforms } from "./pipeline";

var md = new Remarkable({ breaks: true });
md.inline.ruler.enable(["ins", "mark", "sub", "sup"]);

function setSelectValue(id, value, setToDefault = false) {
  const target = document.getElementById(id);

  if (!target) {
    return;
  }

  const options = [...target.options];
  if (setToDefault) {
    value = target.dataset.default.toString();
  }

  let currentValue = target.value;
  let maxIterations = value === null ? 1 : options.length;
  let iterationCount = 0;
  let newSelectedIndex;

  while (currentValue !== value) {
    iterationCount += 1;
    const selectedIndex = target.selectedIndex;

    newSelectedIndex = selectedIndex + 1;
    if (newSelectedIndex > options.length - 1) {
      newSelectedIndex = 0;
    }

    target.selectedIndex = newSelectedIndex;
    currentValue = target.value;

    if (iterationCount >= maxIterations) {
      break;
    }
  }

  const setting = target.closest("div.setting");
  if (setting) {
    setting.classList.remove("selected", "all", "zero", "one", "two", "three");
    if (currentValue === "true") {
      setting.classList.add("selected");
    } else if (currentValue === "999") {
      setting.classList.add("all");
    } else if (currentValue === "0") {
      setting.classList.add("zero");
    } else if (currentValue === "1") {
      setting.classList.add("one");
    } else if (currentValue === "2") {
      setting.classList.add("two");
    } else if (currentValue === "3") {
      setting.classList.add("three");
    }
  }

  const searchParams = new URLSearchParams(window.location.search);
  if (newSelectedIndex === 0) {
    searchParams.delete(target.id);
  } else {
    searchParams.set(target.id, currentValue);
  }

  const newRelativePathQuery =
    window.location.pathname + "?" + searchParams.toString();
  history.pushState(null, "", newRelativePathQuery);
}

function getSettings() {
  return {
    flatten_indentation: Number(document.getElementById("flatten-indentation").value),
    remove_bullets: document.getElementById("remove-bullets").value === "true",
    remove_double_brackets:
      document.getElementById("remove-double-brackets").value === "true",
    remove_double_braces:
      document.getElementById("remove-double-braces").value === "true",
    remove_formatting: document.getElementById("remove-formatting").value === "true",
    add_line_breaks: Number(document.getElementById("add-line-breaks").value),
    remove_colon_from_attributes:
      document.getElementById("remove-colon-from-attributes").value === "true",
    remove_quotes: document.getElementById("remove-quotes").value === "true",
    remove_hashtag_marks:
      document.getElementById("remove-hashtag-marks").value === "true",
    hide_settings: document.getElementById("hide-settings").value === "true",
    remove_todos: document.getElementById("remove-todos").value === "true",
    remove_namespaces: document.getElementById("remove-namespaces").value === "true",
    export_latex: document.getElementById("export-latex").value === "true"
  };
}

function hideSettings() {
  const parentDiv = document.querySelector("div.parent");
  parentDiv.style.gridTemplateColumns = "0 repeat(2, 1fr)";
  const settingsContainer = document.querySelector("div.settings-container");
  settingsContainer.style.display = "none";
}

function showSettings() {
  const parentDiv = document.querySelector("div.parent");
  parentDiv.style.gridTemplateColumns = null;
  const settingsContainer = document.querySelector("div.settings-container");
  settingsContainer.style.display = null;
}

function render() {
  const settings = getSettings();

  if (isNaN(settings.add_line_breaks)) {
    settings.add_line_breaks = 0;
  }

  const input = document.getElementById("input").value;
  const transformed = applyTransforms(input, settings);

  if (settings.hide_settings) {
    hideSettings();
  } else {
    showSettings();
  }

  if (settings.export_latex) {
    document.getElementById("output").value = transformed.latexResult;
    document.getElementById("rendered-output").innerHTML = `LaTeX only output, see above
<a href="data:application/x-latex;base64,${btoa(transformed.latexResult)}" download="roam-tools-latex-export.tex">download latex file</a
    `;
    return;
  }

  document.getElementById("output").value = transformed.result;
  document.getElementById("rendered-output").innerHTML =
    md.render(transformed.markdownResult, { gfm: true }) + "<br />";
}

$(document).ready(function() {
  document.querySelectorAll("label.toggle-on-click").forEach(function(label) {
    label.addEventListener("click", function(e) {
      if (e.target !== e.currentTarget) {
        return;
      }

      const target = e.currentTarget.querySelector("select");
      if (!target) {
        return;
      }
      setSelectValue(target.id, null);
      render();
    });
  });

  document.getElementById("input").addEventListener("change", render);
  document.getElementById("input").addEventListener("keyup", render);

  document.querySelector(".reset-options").addEventListener("click", function(e) {
    e.preventDefault();
    document.querySelectorAll(".hidden-select-setting").forEach(function(target) {
      setSelectValue(target.id, null, true);
    });
    history.pushState(null, "", window.location.pathname);
    render();
  });

  const urlParams = new URLSearchParams(window.location.search);
  urlParams.forEach(function(value, key) {
    setSelectValue(key, value);
  });

  render();
});
