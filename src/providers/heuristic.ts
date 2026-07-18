import { AuditIssue, IAuditProvider, ProviderType } from '../types.js';
import { allAuditRules } from '../rules/index.js';

export class HeuristicProvider implements IAuditProvider {
  name = 'Built-in Heuristic AI Engine';
  type: ProviderType = 'heuristic';

  private rulesFilter?: string[];

  constructor(rulesFilter?: string[]) {
    this.rulesFilter = rulesFilter;
  }

  async audit(files: { path: string; content: string }[]): Promise<AuditIssue[]> {
    const issues: AuditIssue[] = [];

    const activeRules = this.rulesFilter
      ? allAuditRules.filter((r) => this.rulesFilter!.includes(r.id))
      : allAuditRules;

    for (const file of files) {
      for (const rule of activeRules) {
        const fileIssues = rule.check({
          filePath: file.path,
          content: file.content,
        });
        issues.push(...fileIssues);
      }
    }

    return issues;
  }
}
