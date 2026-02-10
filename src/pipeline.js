import {
  addLineBreaksBeforeParagraphs,
  convertForMarkdown,
  convertTodoAndDone,
  flattenIndentation,
  removeBullets,
  removeColonFromAttributes,
  removeDoubleBraces,
  removeDoubleBrackets,
  removeFormatting,
  removeHashtagMarks,
  removeNamespaces,
  removeQuotes,
  removeTodos,
  renderLatex
} from "./transforms";

export function applyTransforms(input, settings) {
  let result = input;
  let latexResult;

  result = addLineBreaksBeforeParagraphs(result, settings.add_line_breaks);

  if (settings.flatten_indentation) {
    result = flattenIndentation(result, settings.flatten_indentation);
  }

  if (settings.remove_bullets) {
    result = removeBullets(result);
  }

  if (settings.remove_double_braces) {
    result = removeDoubleBraces(result);
  }

  if (settings.remove_todos) {
    result = removeTodos(result);
  }

  result = convertTodoAndDone(result);

  if (settings.remove_namespaces) {
    result = removeNamespaces(result);
  }

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

  if (settings.export_latex) {
    latexResult = renderLatex(result);
  }

  return {
    result,
    latexResult,
    markdownResult: convertForMarkdown(result)
  };
}
