export function convertForMarkdown(input) {
  return input
    .split("\n")
    .map(function(line) {
      return line.replace(/__/gm, "_");
    })
    .map(function(line) {
      return line.replace(/\^\^(.+)\^\^/gm, "==$1==");
    })
    .map(function(line) {
      return line.replace(/\b(.+\:\:)/gm, "**$1**");
    })
    .map(function(line) {
      if (line.trim().startsWith("- ")) {
        return line;
      }
      return line.replace(/\s\s\s\s/gm, "&nbsp;&nbsp;&nbsp;&nbsp;");
    })
    .join("\n");
}

export function convertTodoAndDone(input) {
  return input
    .split("\n")
    .map(function(line) {
      return line.replace("{{[[TODO]]}}", "☐").replace("{{[[DONE]]}}", "☑︎");
    })
    .join("\n");
}

export function removeTodos(input) {
  return input
    .split("\n")
    .map(function(line) {
      return line
        .replace(/\{\{\[\[TODO\]\]\}\}\s?/, "")
        .replace(/\{\{\[\[DONE\]\]\}\}\s?/, "");
    })
    .join("\n");
}

export function addLineBreaksBeforeParagraphs(input, numberOfLineBreaks) {
  return input
    .split("\n")
    .map(function(line, index) {
      if (index > 0 && numberOfLineBreaks > 0 && line.trimStart() === line) {
        return "\n".repeat(numberOfLineBreaks) + line;
      }
      return line;
    })
    .join("\n");
}

export function flattenIndentation(input, flattenIndentationLevel) {
  if (flattenIndentationLevel > 5) {
    return input
      .split("\n")
      .map(function(line) {
        return line.trimStart();
      })
      .join("\n");
  }

  let output = input;
  for (let idx = 0; idx < flattenIndentationLevel; idx++) {
    output = output
      .split("\n")
      .map(function(line) {
        return line.replace(/^\s\s\s\s(.+)/gm, "$1");
      })
      .join("\n");
  }
  return output;
}

export function removeBullets(input) {
  return input
    .split("\n")
    .map(function(line) {
      return line.replace(/^(\s*)-\s/gm, "$1");
    })
    .join("\n");
}

export function removeColonFromAttributes(input) {
  return input
    .split("\n")
    .map(function(line) {
      return line.replace(/\b(.+)\:\:/gm, "$1:");
    })
    .join("\n");
}

export function removeQuotes(input) {
  return input
    .split("\n")
    .map(function(line) {
      return line.replace(/\"(.+)\"/gm, "$1");
    })
    .join("\n");
}

export function removeHashtagMarks(input) {
  return input
    .split("\n")
    .map(function(line) {
      return line.replace(/\#(.+)\b/gm, "$1");
    })
    .join("\n");
}

export function removeDoubleBraces(input) {
  return input
    .split("\n")
    .map(function(line) {
      return line.replace(/\{\{([^\{\}]+)\}\}/gm, "$1");
    })
    .join("\n");
}

export function removeNamespaces(input) {
  const result = input
    .split("\n")
    .map(function(line) {
      return line.replace(/\[\[(.+?)\/(.+?)\]\]/gm, "[[$2]]");
    })
    .join("\n");

  const matches = [...result.matchAll(/\[\[(.+?)\/(.+?)\]\]/gm)];
  if (matches.length > 0) {
    return removeNamespaces(result);
  }
  return result;
}

export function removeDoubleBrackets(input) {
  const result = input
    .split("\n")
    .map(function(line) {
      return line
        .replace(/\[([^\[\]]+)\]\((\[\[|\(\()([^\[\]]+)(\]\]|\)\))\)/gm, "$1")
        .replace(/\[\[([^\[\]]+)\]\]/gm, "$1")
        .replace(/\(\(([^\(\)]+)\)\)/gm, "$1");
    })
    .join("\n");

  const matches = [
    ...result.matchAll(/\[([^\[\]]+)\]\((\[\[|\(\()([^\[\]]+)(\]\]|\)\))\)/gm),
    ...result.matchAll(/\[\[([^\[\]]+)\]\]/gm),
    ...result.matchAll(/\(\(([^\(\)]+)\)\)/gm)
  ];
  if (matches.length > 0) {
    return removeDoubleBrackets(result);
  }
  return result;
}

export function removeFormatting(input) {
  return input
    .split("\n")
    .map(function(line) {
      return line
        .replace(/\*\*(.+?)\*\*/gm, "$1")
        .replace(/\_\_(.+?)\_\_/gm, "$1")
        .replace(/\^\^(.+?)\^\^/gm, "$1");
    })
    .join("\n");
}

function renderLatexLink(text) {
  if (!text.match(/^[a-zA-Z]+[0-9]+[a-zA-Z]*$/)) {
    return text;
  }
  return `\\cite{${text}}`;
}

function replaceMarkupVia(text, rx, viaFn) {
  const chunks = text.split(rx);
  for (let i = 1; i < chunks.length; i += 2) {
    chunks[i] = viaFn(chunks[i]);
  }
  return chunks.join("");
}

export function renderLatex(input) {
  let output = "";
  let sectionIndent;
  let parIndent;

  for (let line of input.split("\n")) {
    let indent = line.match(/^ */)[0].length;
    line = line.replace(/^ *(- )?/, "");

    let isSection = /^#/.test(line);
    if (isSection) {
      sectionIndent = indent;
      parIndent = undefined;
    }
    if (!isSection && parIndent === undefined) {
      parIndent = indent;
    }

    line = line.replace(/^# (.*)/, "\n\\section{$1}");
    line = line.replace(/^## (.*)/, "\n\\subsection{$1}");
    line = line.replace(/^### (.*)/, "\n\\subsubsection{$1}");

    line = replaceMarkupVia(line, /__/g, text => `\\emph{${text}}`);
    line = replaceMarkupVia(line, /\*\*/g, text => `\\textbf{${text}}`);
    line = line.replace(/\^\^/g, "");
    line = line.replace(/\$\$/g, "$");

    line = line.replace(/\[\[([^\]]*)\]\]/g, function(match, linktext) {
      return renderLatexLink(linktext);
    });

    if (indent <= parIndent) {
      output += "\n";
      parIndent = indent;
    }

    output += line + "\n";
  }

  void sectionIndent;
  return output;
}
