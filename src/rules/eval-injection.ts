import { AuditIssue, AuditRule, AuditRuleContext } from '../types.js';

export const evalInjectionRule: AuditRule = {
  id: 'eval-injection',
  name: 'Dynamic Code Execution Injection Risk',
  description: 'Flags dangerous eval() or dynamic Function() execution vectors.',
  severity: 'error',
  check(context: AuditRuleContext): AuditIssue[] {
    const issues: AuditIssue[] = [];
    const lines = context.content.split('\n');

    lines.forEach((line, index) => {
      if (/\beval\s*\(/.test(line)) {
        issues.push({
          id: `${context.filePath}-${index + 1}-eval-injection`,
          ruleId: 'eval-injection',
          severity: 'error',
          message: 'Critical security risk: "eval()" call detected.',
          file: context.filePath,
          line: index + 1,
          snippet: line.trim(),
          suggestion: 'Refactor code to avoid eval(). Use static parsers or JSON.parse().',
        });
      } else if (/\bnew\s+Function\s*\(/.test(line)) {
        issues.push({
          id: `${context.filePath}-${index + 1}-eval-injection-function`,
          ruleId: 'eval-injection',
          severity: 'error',
          message: 'Security risk: "new Function()" dynamic code evaluation.',
          file: context.filePath,
          line: index + 1,
          snippet: line.trim(),
          suggestion: 'Avoid dynamic string-to-code compilation in production.',
        });
      }
    });

    return issues;
  },
};
