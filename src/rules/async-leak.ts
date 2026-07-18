import { AuditIssue, AuditRule, AuditRuleContext } from '../types.js';

export const asyncLeakRule: AuditRule = {
  id: 'unhandled-async-promise',
  name: 'Unhandled Async Promise',
  description: 'Detects unhandled promises or floating async calls without await/catch.',
  severity: 'error',
  check(context: AuditRuleContext): AuditIssue[] {
    const issues: AuditIssue[] = [];
    const lines = context.content.split('\n');

    lines.forEach((line, index) => {
      // Matches async functions called without await or return or assignment or .then/.catch
      const floatingAsyncMatch =
        /^\s*(fetch\(|axios\.|asyncFunction\(|fs\.promises\.)/i.test(line) &&
        !line.includes('await ') &&
        !line.includes('return ') &&
        !line.includes('const ') &&
        !line.includes('let ') &&
        !line.includes('var ') &&
        !line.includes('.then(') &&
        !line.includes('.catch(');

      if (floatingAsyncMatch) {
        issues.push({
          id: `${context.filePath}-${index + 1}-unhandled-async-promise`,
          ruleId: 'unhandled-async-promise',
          severity: 'error',
          message: 'Unhandled asynchronous promise detected. Missing "await" or error handler.',
          file: context.filePath,
          line: index + 1,
          snippet: line.trim(),
          suggestion: 'Prefix with "await" or handle with ".catch()".',
        });
      }
    });

    return issues;
  },
};
