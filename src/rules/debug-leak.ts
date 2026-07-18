import { AuditIssue, AuditRule, AuditRuleContext } from '../types.js';

export const debugLeakRule: AuditRule = {
  id: 'debug-leak',
  name: 'Debug Code Leak',
  description:
    'Flags leftover debugger statements, console.log, or alert calls in production code.',
  severity: 'warning',
  check(context: AuditRuleContext): AuditIssue[] {
    const issues: AuditIssue[] = [];
    const lines = context.content.split('\n');

    lines.forEach((line, index) => {
      if (/^\s*debugger\s*;?$/.test(line)) {
        issues.push({
          id: `${context.filePath}-${index + 1}-debug-leak-debugger`,
          ruleId: 'debug-leak',
          severity: 'error',
          message: 'Leftover "debugger" statement found.',
          file: context.filePath,
          line: index + 1,
          snippet: line.trim(),
          suggestion: 'Remove debugger statement before committing to production.',
        });
      } else if (/\bconsole\.(log|debug|trace)\s*\(/.test(line)) {
        issues.push({
          id: `${context.filePath}-${index + 1}-debug-leak-console`,
          ruleId: 'debug-leak',
          severity: 'warning',
          message: 'Console debug statement detected in production code.',
          file: context.filePath,
          line: index + 1,
          snippet: line.trim(),
          suggestion: 'Remove console log or replace with structured logging.',
        });
      } else if (/\balert\s*\(/.test(line)) {
        issues.push({
          id: `${context.filePath}-${index + 1}-debug-leak-alert`,
          ruleId: 'debug-leak',
          severity: 'warning',
          message: 'Browser "alert()" call detected.',
          file: context.filePath,
          line: index + 1,
          snippet: line.trim(),
          suggestion: 'Replace alert() with UI feedback modal or logger.',
        });
      }
    });

    return issues;
  },
};
