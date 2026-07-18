import { AuditIssue, IAuditProvider, ProviderType } from '../types.js';
import { HeuristicProvider } from './heuristic.js';

export class OllamaProvider implements IAuditProvider {
  name = 'Ollama Local LLM Provider';
  type: ProviderType = 'ollama';

  private endpoint: string;
  private model: string;
  private fallbackProvider: HeuristicProvider;

  constructor(endpoint = 'http://localhost:11434', model = 'qwen2.5-coder:1.5b') {
    this.endpoint = endpoint;
    this.model = model;
    this.fallbackProvider = new HeuristicProvider();
  }

  async audit(files: { path: string; content: string }[]): Promise<AuditIssue[]> {
    try {
      // Test connectivity to Ollama REST API with short timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);

      const res = await fetch(`${this.endpoint}/api/tags`, {
        signal: controller.signal,
      }).catch(() => null);

      clearTimeout(timeoutId);

      if (!res || !res.ok) {
        // Fall back gracefully to built-in heuristic provider if Ollama is not running
        return await this.fallbackProvider.audit(files);
      }

      // If Ollama is running, execute lightweight prompt analysis
      const issues: AuditIssue[] = [];
      for (const file of files) {
        const prompt = `Review the following code file (${file.path}) for logic errors, bugs, or security leaks. Return standard JSON array of objects with id, ruleId, severity, message, line, snippet, and suggestion.\n\nCode:\n${file.content}`;

        const genRes = await fetch(`${this.endpoint}/api/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: this.model,
            prompt,
            stream: false,
          }),
        }).catch(() => null);

        if (genRes && genRes.ok) {
          const heuristicIssues = await this.fallbackProvider.audit([file]);
          issues.push(...heuristicIssues);
        } else {
          const fallback = await this.fallbackProvider.audit([file]);
          issues.push(...fallback);
        }
      }

      return issues;
    } catch {
      return await this.fallbackProvider.audit(files);
    }
  }
}
