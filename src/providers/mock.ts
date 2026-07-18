import { AuditIssue, IAuditProvider, ProviderType } from '../types.js';

export class MockProvider implements IAuditProvider {
  name = 'Mock AI Test Provider';
  type: ProviderType = 'mock';

  async audit(files: { path: string; content: string }[]): Promise<AuditIssue[]> {
    const issues: AuditIssue[] = [];

    for (const file of files) {
      if (file.content.includes('INSECURE_MOCK_TRIGGER')) {
        issues.push({
          id: `${file.path}-mock-trigger`,
          ruleId: 'mock-test-rule',
          severity: 'error',
          message: 'Mock insecure pattern triggered for testing.',
          file: file.path,
          line: 1,
          snippet: 'INSECURE_MOCK_TRIGGER',
          suggestion: 'Remove mock trigger pattern.',
        });
      }
    }

    return issues;
  }
}
