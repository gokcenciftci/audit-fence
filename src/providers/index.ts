import { IAuditProvider, ProviderType } from '../types.js';
import { HeuristicProvider } from './heuristic.js';
import { OllamaProvider } from './ollama.js';
import { MockProvider } from './mock.js';

export function resolveProvider(
  type: ProviderType = 'heuristic',
  options?: { endpoint?: string; model?: string; rules?: string[] }
): IAuditProvider {
  switch (type) {
    case 'ollama':
      return new OllamaProvider(options?.endpoint, options?.model);
    case 'mock':
      return new MockProvider();
    case 'heuristic':
    default:
      return new HeuristicProvider(options?.rules);
  }
}

export { HeuristicProvider, OllamaProvider, MockProvider };
