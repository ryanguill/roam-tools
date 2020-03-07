$(document).ready(function() {
  $("label.toggle-on-click").on("click", function(e) {
    const $target = $(e.target).find("select");
    if (!$target.length) {
      return;
    }
    const selectedIndex = $target.get(0).selectedIndex;
    const options = [...$target.get(0).options];
    let newSelectedIndex = selectedIndex + 1;
    if (newSelectedIndex > options.length - 1) {
      newSelectedIndex = 0;
    }
    $target.prop("selectedIndex", newSelectedIndex);

    if ($target.val() === "true") {
      $target.closest("div.setting").addClass("selected");
    } else {
      $target.closest("div.setting").removeClass("selected");
    }
    render();
  });

  $("#input").on("change keyup", render);

  render();
});

function render() {
  const settings = {
    flatten_indentation: $("#flatten-indentation").val() === "true",
    remove_bullets: $("#remove-bullets").val() === "true",
    remove_double_brackets: $("#remove-double-brackets").val() === "true",
    remove_formatting: $("#remove-formatting").val() === "true"
  };

  //console.log(settings);

  const input = $("#input").val();
  let result = input;

  if (settings.flatten_indentation) {
    result = flattenIndentation(result);
  }

  if (settings.remove_bullets) {
    result = removeBullets(result);
  }

  if (settings.remove_double_brackets) {
    result = removeDoubleBrackets(result);
  }

  if (settings.remove_formatting) {
    result = removeFormatting(result);
  }

  $("#output").val(result);
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
