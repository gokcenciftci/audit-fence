import { AuditIssue, AuditRule, AuditRuleContext } from '../types.js';

export const memoryLeakRule: AuditRule = {
  id: 'memory-leak-listener',
  name: 'Memory Leak Event Listener',
  description: 'Flags event listeners or timers added without cleanup handlers.',
  severity: 'warning',
  check(context: AuditRuleContext): AuditIssue[] {
    const issues: AuditIssue[] = [];
    const content = context.content;

    const hasAddListener = /addEventListener\s*\(/.test(content);
    const hasRemoveListener = /removeEventListener\s*\(/.test(content);
    const hasSetInterval = /setInterval\s*\(/.test(content);
    const hasClearInterval = /clearInterval\s*\(/.test(content);

    if (hasAddListener && !hasRemoveListener) {
      issues.push({
        id: `${context.filePath}-memory-leak-listener`,
        ruleId: 'memory-leak-listener',
        severity: 'warning',
        message: 'addEventListener attached without matching removeEventListener cleanup.',
        file: context.filePath,
        suggestion: 'Ensure listener is removed on component unmount or teardown.',
      });
    }

    if (hasSetInterval && !hasClearInterval) {
      issues.push({
        id: `${context.filePath}-memory-leak-interval`,
        ruleId: 'memory-leak-listener',
        severity: 'warning',
        message: 'setInterval created without matching clearInterval cleanup.',
        file: context.filePath,
        suggestion: 'Store interval ID and call clearInterval during cleanup.',
      });
    }

    return issues;
  },
};
