import { describe, expect, it } from "bun:test";
import { applyTransforms } from "../src/pipeline";

function makeSettings(overrides = {}) {
  return {
    flatten_indentation: 0,
    remove_bullets: false,
    remove_double_brackets: false,
    remove_double_braces: false,
    remove_formatting: false,
    add_line_breaks: 0,
    remove_colon_from_attributes: false,
    remove_quotes: false,
    remove_hashtag_marks: false,
    hide_settings: false,
    remove_todos: false,
    remove_namespaces: false,
    export_latex: false,
    ...overrides
  };
}

describe("applyTransforms", function() {
  it("converts TODO markers when remove_todos is disabled", function() {
    const settings = makeSettings({ remove_todos: false });
    const output = applyTransforms("{{[[TODO]]}} task", settings);
    expect(output.result).toBe("☐ task");
  });

  it("removes TODO markers when remove_todos is enabled", function() {
    const settings = makeSettings({ remove_todos: true });
    const output = applyTransforms("{{[[TODO]]}} task", settings);
    expect(output.result).toBe("task");
  });

  it("applies bracket and namespace cleanup together", function() {
    const settings = makeSettings({
      remove_namespaces: true,
      remove_double_brackets: true
    });
    const output = applyTransforms("[[work/project/task]]", settings);
    expect(output.result).toBe("task");
  });

  it("returns latex output when export_latex is enabled", function() {
    const settings = makeSettings({ export_latex: true });
    const output = applyTransforms("# Title\n[[Smith2020]]", settings);
    expect(output.latexResult.includes("\\section{Title}")).toBe(true);
    expect(output.latexResult.includes("\\cite{Smith2020}")).toBe(true);
  });
});
