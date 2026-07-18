export type Severity = 'error' | 'warning' | 'info';

export type ProviderType = 'heuristic' | 'ollama' | 'mock';

export interface AuditIssue {
  id: string;
  ruleId: string;
  severity: Severity;
  message: string;
  file: string;
  line?: number;
  column?: number;
  snippet?: string;
  suggestion?: string;
}

export interface AuditRuleContext {
  filePath: string;
  content: string;
}

export interface AuditRule {
  id: string;
  name: string;
  description: string;
  severity: Severity;
  check: (context: AuditRuleContext) => AuditIssue[];
}

export interface ProviderConfig {
  type: ProviderType;
  endpoint?: string;
  model?: string;
  rules?: string[];
}

export interface IAuditProvider {
  name: string;
  type: ProviderType;
  audit: (files: { path: string; content: string }[]) => Promise<AuditIssue[]>;
}

export interface ScannerOptions {
  paths?: string[];
  provider?: ProviderType;
  rules?: string[];
  ollamaEndpoint?: string;
  ollamaModel?: string;
}
