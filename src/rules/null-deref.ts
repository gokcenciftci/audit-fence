import { AuditIssue, AuditRule, AuditRuleContext } from '../types.js';

export const nullDerefRule: AuditRule = {
  id: 'logic-null-deref',
  name: 'Potential Null Dereference',
  description: 'Detects unsafe property accesses without optional chaining or null checks.',
  severity: 'warning',
  check(context: AuditRuleContext): AuditIssue[] {
    const issues: AuditIssue[] = [];
    const lines = context.content.split('\n');

    lines.forEach((line, index) => {
      // Matches pattern like response.data.user.id without optional chaining in nested property calls
      if (
        /[a-zA-Z0-9_$]+\.[a-zA-Z0-9_$]+\.[a-zA-Z0-9_$]+\.[a-zA-Z0-9_$]+/.test(line) &&
        !line.includes('?.') &&
        !line.includes('if (') &&
        !line.includes('// eslint-disable')
      ) {
        issues.push({
          id: `${context.filePath}-${index + 1}-logic-null-deref`,
          ruleId: 'logic-null-deref',
          severity: 'warning',
          message: 'Deep object property access without optional chaining ("?.")',
          file: context.filePath,
          line: index + 1,
          snippet: line.trim(),
          suggestion: 'Use optional chaining ("?.") to prevent runtime TypeError.',
        });
      }
    });

    return issues;
  },
};
