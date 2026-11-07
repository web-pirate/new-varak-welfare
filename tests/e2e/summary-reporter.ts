import fs from "node:fs";
import path from "node:path";
import type { FullResult, Reporter, TestCase, TestResult } from "@playwright/test/reporter";

// Writes a plain-language summary next to the HTML report: what passed, what broke, and why.
export default class SummaryReporter implements Reporter {
  private rows: { test: TestCase; result: TestResult }[] = [];
  constructor(private options: { file: string }) {}

  onTestEnd(test: TestCase, result: TestResult) {
    this.rows.push({ test, result });
  }

  onEnd(result: FullResult) {
    const failed = this.rows.filter((r) => r.result.status !== "passed" && r.result.status !== "skipped");
    const skipped = this.rows.filter((r) => r.result.status === "skipped");
    const passed = this.rows.length - failed.length - skipped.length;
    const title = (t: TestCase) => t.titlePath().filter(Boolean).slice(1).join(" > ");

    const lines = [
      `# E2E report ${path.basename(path.dirname(this.options.file))}`,
      "",
      `Overall: **${result.status}** (${passed} passed, ${failed.length} failed, ${skipped.length} skipped)`,
      "",
    ];
    if (failed.length) {
      lines.push("## What broke", "");
      for (const { test, result: r } of failed) {
        const msg = (r.error?.message ?? "unknown error").replace(/\u001b\[[0-9;]*m/g, "").split("\n").slice(0, 6).join("\n");
        lines.push(`### ${title(test)} [${test.parent.project()?.name}]`, "```", msg, "```", "");
      }
    }
    if (skipped.length) {
      lines.push("## Skipped", "", ...skipped.map(({ test }) => `- ${title(test)}`), "");
    }
    lines.push("## Passed", "", ...this.rows.filter((r) => r.result.status === "passed").map(({ test }) => `- ${title(test)} [${test.parent.project()?.name}]`), "");

    fs.mkdirSync(path.dirname(this.options.file), { recursive: true });
    fs.writeFileSync(this.options.file, lines.join("\n"));
    console.log(`\nSummary: ${this.options.file}`);
  }
}
