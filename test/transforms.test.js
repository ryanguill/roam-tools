import { describe, expect, it } from "bun:test";
import {
  addLineBreaksBeforeParagraphs,
  convertForMarkdown,
  convertTodoAndDone,
  flattenIndentation,
  removeBullets,
  removeDoubleBrackets,
  removeNamespaces,
  removeTodos,
  renderLatex
} from "../src/transforms";

describe("transforms", function() {
  it("removes bullets while preserving indentation", function() {
    const input = "- top\n    - child";
    expect(removeBullets(input)).toBe("top\n    child");
  });

  it("removes nested namespaces recursively", function() {
    expect(removeNamespaces("[[topic/subtopic/item]]")).toBe("[[item]]");
  });

  it("removes roam links and block refs", function() {
    const input = "[[Page]] [Alias]([[Target]]) ((abcdef))";
    expect(removeDoubleBrackets(input)).toBe("Page Alias abcdef");
  });

  it("converts TODO and DONE markers", function() {
    const input = "{{[[TODO]]}} one\n{{[[DONE]]}} two";
    expect(convertTodoAndDone(input)).toBe("☐ one\n☑︎ two");
  });

  it("can fully remove TODO and DONE markers", function() {
    const input = "{{[[TODO]]}} one\n{{[[DONE]]}} two";
    expect(removeTodos(input)).toBe("one\ntwo");
  });

  it("adds line breaks only before top-level paragraphs", function() {
    const input = "first\nsecond\n    child";
    expect(addLineBreaksBeforeParagraphs(input, 1)).toBe("first\n\nsecond\n    child");
  });

  it("flattens all indentation when value is greater than five", function() {
    const input = "    one\n        two";
    expect(flattenIndentation(input, 999)).toBe("one\ntwo");
  });

  it("converts roam markdown for remarkable output", function() {
    const input = "__italic__\n^^highlight^^\nattr:: value";
    expect(convertForMarkdown(input)).toBe("_italic_\n==highlight==\n**attr::** value");
  });

  it("renders latex citations for citation-like links only", function() {
    const input = "# Heading\n- [[Smith2020]]\n- [[not-a-citation]]";
    const output = renderLatex(input);
    expect(output.includes("\\section{Heading}")).toBe(true);
    expect(output.includes("\\cite{Smith2020}")).toBe(true);
    expect(output.includes("not-a-citation")).toBe(true);
  });
});
