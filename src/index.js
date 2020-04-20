import { Remarkable } from "remarkable";
var md = new Remarkable({ breaks: true });

md.inline.ruler.enable(["ins", "mark", "sub", "sup"]);

function setSelectValue(id, value) {
  const $target = $("#" + id);
  const options = [...$target.get(0).options];
  let currentValue = $target.val();
  let maxIterations = value === null ? 1 : options.length;
  let iterationCount = 0;
  let newSelectedIndex;

  while (currentValue !== value) {
    iterationCount += 1;
    const selectedIndex = $target.get(0).selectedIndex;

    newSelectedIndex = selectedIndex + 1;
    if (newSelectedIndex > options.length - 1) {
      newSelectedIndex = 0;
    }
    $target.prop("selectedIndex", newSelectedIndex);
    currentValue = $target.val();
    if (iterationCount >= maxIterations) {
      //we looped around and didnt find the target value, so stop
      break;
    }
  }

  $target.closest("div.setting").removeClass("selected");
  $target.closest("div.setting").removeClass("zero");
  $target.closest("div.setting").removeClass("one");
  $target.closest("div.setting").removeClass("two");
  if (currentValue === "true") {
    $target.closest("div.setting").addClass("selected");
  } else if (currentValue === "0") {
    $target.closest("div.setting").addClass("zero");
  } else if (currentValue === "1") {
    $target.closest("div.setting").addClass("one");
  } else if (currentValue === "2") {
    $target.closest("div.setting").addClass("two");
  }

  var searchParams = new URLSearchParams(window.location.search);
  if (newSelectedIndex === 0) {
    searchParams.delete($target.attr("id"));
  } else {
    searchParams.set($target.attr("id"), currentValue);
  }
  var newRelativePathQuery =
    window.location.pathname + "?" + searchParams.toString();
  history.pushState(null, "", newRelativePathQuery);
}

$(document).ready(function() {
  $("label.toggle-on-click").on("click", function(e) {
    const $target = $(e.target).find("select");
    if (!$target.length) {
      return;
    }
    setSelectValue($target.attr("id"), null);

    render();
  });

  $("#input").on("change keyup", render);

  const urlParams = new URLSearchParams(window.location.search);
  urlParams.forEach(function(value, key) {
    setSelectValue(key, value);
  });

  render();
});

function render() {
  const settings = {
    flatten_indentation: $("#flatten-indentation").val() === "true",
    remove_bullets: $("#remove-bullets").val() === "true",
    remove_double_brackets: $("#remove-double-brackets").val() === "true",
    remove_double_braces: $("#remove-double-braces").val() === "true",
    remove_formatting: $("#remove-formatting").val() === "true",
    add_line_breaks: Number($("#add-line-breaks").val()),
    remove_colon_from_attributes:
      $("#remove-colon-from-attributes").val() === "true",
    remove_quotes: $("#remove-quotes").val() === "true",
    remove_hashtag_marks: $("#remove-hashtag-marks").val() === "true"
  };

  if (isNaN(settings.add_line_breaks)) {
    settings.add_line_breaks = 0;
  }

  //console.log(settings);

  const input = $("#input").val();
  let result = input;

  result = addLineBreaksBeforeParagraphs(result, settings.add_line_breaks);

  if (settings.flatten_indentation) {
    result = flattenIndentation(result);
  }

  if (settings.remove_bullets) {
    result = removeBullets(result);
  }

  if (settings.remove_double_braces) {
    result = removeDoubleBraces(result);
  }

  result = convertTodoAndDone(result);

  if (settings.remove_double_brackets) {
    result = removeDoubleBrackets(result);
  }

  if (settings.remove_colon_from_attributes) {
    result = removeColonFromAttributes(result);
  }

  if (settings.remove_quotes) {
    result = removeQuotes(result);
  }

  if (settings.remove_hashtag_marks) {
    result = removeHashtagMarks(result);
  }

  if (settings.remove_formatting) {
    result = removeFormatting(result);
  }

  $("#output").val(result);

  $("#rendered-output").html(
    md.render(convertForMarkdown(result), { gfm: true }) + `<br />`
  );
  //$("#rendered-output").html(`<pre>` + convertForMarkdown(result) + `</pre>`);
}

function convertForMarkdown(input) {
  return input
    .split("\n")
    .map(function(line) {
      return line.replace(/__/gm, `_`);
    })
    .map(function(line) {
      return line.replace(/\^\^(.+)\^\^/gm, `==$1==`);
    })
    .map(function(line) {
      return line.replace(/\b(.+\:\:)/gm, `**$1**`);
    })
    .join("\n");
}

function convertTodoAndDone(input) {
  return input
    .split("\n")
    .map(function(line) {
      return line.replace("{{[[TODO]]}}", "☐").replace("{{[[DONE]]}}", "☑︎");
    })
    .join("\n");
}

function addLineBreaksBeforeParagraphs(input, numberOfLineBreaks) {
  return input
    .split("\n")
    .map(function(line, index) {
      //dont add line breaks before the first paragraph
      if (index > 0 && numberOfLineBreaks > 0 && line.trimStart() === line) {
        return "\n".repeat(numberOfLineBreaks) + line;
      }
      return line;
    })
    .join("\n");
}

function flattenIndentation(input) {
  return input
    .split("\n")
    .map(function(line) {
      return line.trimStart();
    })
    .join("\n");
}

function removeBullets(input) {
  return input
    .split("\n")
    .map(function(line) {
      return line.replace(/^(\s*)-\s/gm, "$1");
    })
    .join("\n");
}

function removeColonFromAttributes(input) {
  return input
    .split("\n")
    .map(function(line) {
      return line.replace(/\b(.+)\:\:/gm, "$1:");
    })
    .join("\n");
}

function removeQuotes(input) {
  return input
    .split("\n")
    .map(function(line) {
      return line.replace(/\"(.+)\"/gm, "$1");
    })
    .join("\n");
}

function removeHashtagMarks(input) {
  return input
    .split("\n")
    .map(function(line) {
      return line.replace(/\#(.+)\b/gm, "$1");
    })
    .join("\n");
}

function removeDoubleBraces(input) {
  return input
    .split("\n")
    .map(function(line) {
      return line.replace(/\{\{([^\{\}]+)\}\}/gm, "$1");
    })
    .join("\n");
}

function removeDoubleBrackets(input) {
  return input
    .split("\n")
    .map(function(line) {
      return line
        .replace(/\[([^\[\]]+)\]\((\[\[|\(\()([^\[\]]+)(\]\]|\)\))\)/gm, "$1")
        .replace(/\[\[([^\[\]]+)\]\]/gm, "$1")
        .replace(/\(\(([^\(\)]+)\)\)/gm, "$1");
    })
    .join("\n");
}

function removeFormatting(input) {
  return input
    .split("\n")
    .map(function(line) {
      return line
        .replace(/\*\*(.+)\*\*/gm, "$1")
        .replace(/\_\_(.+)\_\_/gm, "$1")
        .replace(/\^\^(.+)\^\^/gm, "$1");
    })
    .join("\n");
}
